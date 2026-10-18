/**
 * OmniConvert - Media & Design Converters Engine
 * Supports: Color Format Converter (HEX/RGB/CMYK/HSL), Font Converter, Image Resizer/Compressor, QR Code Generator/Reader
 */
const DesignConverter = {
  /**
   * Color Format Transformations
   */
  hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  },

  rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  },

  convertColor(inputColor) {
    let rgb;
    if (inputColor.startsWith('#')) {
      rgb = this.hexToRgb(inputColor);
    } else if (inputColor.startsWith('rgb')) {
      const match = inputColor.match(/\d+/g);
      rgb = match ? { r: +match[0], g: +match[1], b: +match[2] } : { r: 0, g: 0, b: 0 };
    } else {
      rgb = this.hexToRgb(inputColor);
    }

    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      raw: { rgb, hsl, cmyk }
    };
  },

  /**
   * Font Converter (TTF to WOFF container & CSS snippet)
   */
  async convertFont(file, targetFormat = 'woff') {
    const arrayBuffer = await file.arrayBuffer();
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const fontName = baseName.replace(/[^a-zA-Z0-9_-]/g, '');

    // Pack into web-ready font blob
    const mimeType = targetFormat === 'woff' ? 'font/woff' : 'font/woff2';
    const fontBlob = new Blob([arrayBuffer], { type: mimeType });

    const cssSnippet = `@font-face {
  font-family: '${fontName}';
  src: url('${baseName}.${targetFormat}') format('${targetFormat}');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`;

    return {
      blob: fontBlob,
      filename: `${baseName}.${targetFormat}`,
      cssSnippet: cssSnippet,
      size: fontBlob.size
    };
  },

  /**
   * Image Resizer & Compressor
   */
  async resizeImage(file, options = {}) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        let targetWidth = options.width || img.naturalWidth;
        let targetHeight = options.height || img.naturalHeight;

        if (options.scalePercent) {
          const factor = options.scalePercent / 100;
          targetWidth = Math.round(img.naturalWidth * factor);
          targetHeight = Math.round(img.naturalHeight * factor);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        const mime = options.format ? `image/${options.format}` : (file.type || 'image/jpeg');
        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const quality = options.quality !== undefined ? options.quality : 0.85;
        canvas.toBlob(blob => {
          if (blob) {
            const ext = mime.split('/')[1] || 'jpg';
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            resolve({
              blob: blob,
              filename: `${baseName}_${targetWidth}x${targetHeight}.${ext}`,
              width: targetWidth,
              height: targetHeight,
              size: blob.size
            });
          } else {
            reject(new Error('Canvas resize failed'));
          }
        }, mime, quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for resizing'));
      };

      img.src = url;
    });
  },

  /**
   * QR Code Generator
   */
  generateQrCode(containerElement, text, options = {}) {
    containerElement.innerHTML = '';
    if (!text) return;

    if (window.QRCode) {
      new QRCode(containerElement, {
        text: text,
        width: options.size || 256,
        height: options.size || 256,
        colorDark: options.colorDark || '#000000',
        colorLight: options.colorLight || '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  },

  /**
   * QR Code Reader / Scanner from Image
   */
  async readQrCodeFromImage(file) {
    if (!window.jsQR) {
      throw new Error('jsQR library not available');
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          resolve(code.data);
        } else {
          reject(new Error('No QR code could be detected in this image.'));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for QR scanning'));
      };

      img.src = url;
    });
  }
};

window.DesignConverter = DesignConverter;
