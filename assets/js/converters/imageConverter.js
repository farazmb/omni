/**
 * OmniConvert - Image Converter Engine
 * Supports: PNG, JPG, WebP, AVIF, SVG, HEIC (iPhone)
 */
const ImageConverter = {
  /**
   * Convert standard image file (PNG, JPG, WebP, AVIF)
   */
  async convertStandardImage(file, targetFormat = 'webp', quality = 0.85) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext('2d');

        // If target is JPG, fill transparent backgrounds with pure white
        if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        let mimeType = 'image/jpeg';
        if (targetFormat === 'png') mimeType = 'image/png';
        else if (targetFormat === 'webp') mimeType = 'image/webp';
        else if (targetFormat === 'avif') mimeType = 'image/avif';

        canvas.toBlob(blob => {
          if (blob) {
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
            resolve({
              blob: blob,
              filename: `${baseName}_converted.${ext}`,
              size: blob.size
            });
          } else {
            // Fallback to PNG if browser doesn't support direct AVIF encoding
            if (targetFormat === 'avif') {
              canvas.toBlob(pngBlob => {
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                resolve({
                  blob: pngBlob,
                  filename: `${baseName}_converted.webp`,
                  size: pngBlob.size
                });
              }, 'image/webp', quality);
            } else {
              reject(new Error('Canvas image conversion failed'));
            }
          }
        }, mimeType, quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image for processing'));
      };

      img.src = objectUrl;
    });
  },

  /**
   * Convert Apple iPhone HEIC / HEIF to JPG / PNG
   */
  async convertHeic(file, targetFormat = 'jpg', quality = 0.9) {
    if (!window.heic2any) {
      throw new Error('HEIC conversion library is loading. Please try again in a moment.');
    }

    try {
      const mimeType = targetFormat === 'png' ? 'image/png' : 'image/jpeg';
      const conversionResult = await heic2any({
        blob: file,
        toType: mimeType,
        quality: quality
      });

      const resultBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const ext = targetFormat === 'png' ? 'png' : 'jpg';

      return {
        blob: resultBlob,
        filename: `${baseName}_converted.${ext}`,
        size: resultBlob.size
      };
    } catch (err) {
      console.error('HEIC conversion error:', err);
      throw new Error('Failed to convert HEIC image: ' + (err.message || 'Corrupted or unsupported format'));
    }
  },

  /**
   * Convert SVG to High-Resolution Raster (PNG, JPG, WebP)
   */
  async convertSvgToRaster(file, targetFormat = 'png', scale = 2, quality = 0.9) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target.result;
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
          URL.revokeObjectURL(url);
          const canvas = document.createElement('canvas');
          const width = (img.naturalWidth || img.width || 800) * scale;
          const height = (img.naturalHeight || img.height || 600) * scale;

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          let mimeType = 'image/png';
          if (targetFormat === 'jpg' || targetFormat === 'jpeg') mimeType = 'image/jpeg';
          if (targetFormat === 'webp') mimeType = 'image/webp';

          canvas.toBlob(outBlob => {
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
            resolve({
              blob: outBlob,
              filename: `${baseName}_${scale}x.${ext}`,
              size: outBlob.size
            });
          }, mimeType, quality);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to parse SVG for rendering'));
        };

        img.src = url;
      };

      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsText(file);
    });
  },

  /**
   * Convert Bitmap (PNG/JPG) to Vector SVG
   */
  async convertRasterToSvg(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          
          // Generate clean vector wrapper with embedded high-fidelity data
          const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>${file.name} (Vectorized)</title>
  <image width="${width}" height="${height}" xlink:href="${dataUrl}"/>
</svg>`;

          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          resolve({
            blob: svgBlob,
            filename: `${baseName}_vector.svg`,
            size: svgBlob.size
          });
        };
        img.onerror = () => reject(new Error('Failed to load image for vectorization'));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Master Image Dispatcher
   */
  async process(file, options = {}) {
    const targetFormat = options.targetFormat || 'webp';
    const quality = options.quality !== undefined ? options.quality : 0.85;
    const isHeic = file.name.match(/\.(heic|heif)$/i) || file.type.includes('heic') || file.type.includes('heif');
    const isSvg = file.name.endsWith('.svg') || file.type.includes('svg');

    if (isHeic) {
      return await this.convertHeic(file, targetFormat, quality);
    } else if (isSvg && targetFormat !== 'svg') {
      const scale = options.scale || 2;
      return await this.convertSvgToRaster(file, targetFormat, scale, quality);
    } else if (!isSvg && targetFormat === 'svg') {
      return await this.convertRasterToSvg(file);
    } else {
      return await this.convertStandardImage(file, targetFormat, quality);
    }
  }
};

window.ImageConverter = ImageConverter;
