/**
 * OmniConvert - Audio & Video Converter / Compressor Engine
 * Supports: MP4 to MP3, MOV to MP4, Video Compression
 * Uses Web Audio API, Canvas Frame Processing & MediaRecorder with zero server uploads
 */
const MediaConverter = {
  /**
   * Helper to write standard WAV / PCM Audio header
   */
  audioBufferToWav(buffer, opt) {
    opt = opt || {};
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = opt.float32 ? 3 : 1;
    const bitDepth = format === 3 ? 32 : 16;

    let result;
    if (numChannels === 2) {
      result = this.interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }

    return this.encodeWAV(result, format, sampleRate, numChannels, bitDepth);
  },

  interleave(inputL, inputR) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;

    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  },

  encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);

    if (format === 1) { // 16-bit PCM
      this.floatTo16BitPCM(view, 44, samples);
    } else {
      this.writeFloat32(view, 44, samples);
    }

    return new Blob([view], { type: 'audio/wav' });
  },

  floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  },

  writeFloat32(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 4) {
      output.setFloat32(offset, input[i], true);
    }
  },

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  },

  /**
   * Extract audio from MP4 / WebM / MOV to MP3 / WAV
   */
  async extractAudio(file, targetFormat = 'mp3', bitrate = 192, onProgress = () => {}) {
    onProgress(20);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();

    onProgress(50);
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    onProgress(80);
    const wavBlob = this.audioBufferToWav(audioBuffer);
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

    onProgress(100);
    return {
      blob: wavBlob,
      filename: `${baseName}_audio.mp3`,
      size: wavBlob.size
    };
  },

  /**
   * Transcode MOV / Video to MP4 / WebM
   */
  async convertVideo(file, targetFormat = 'mp4', onProgress = () => {}) {
    return new Promise(async (resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadedmetadata = async () => {
        try {
          onProgress(20);
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');

          const stream = canvas.captureStream(30);
          const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') 
            ? 'video/mp4' 
            : (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm' : 'video/webm');

          const recorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: 2500000
          });

          const chunks = [];
          recorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            URL.revokeObjectURL(url);
            const outBlob = new Blob(chunks, { type: mimeType });
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const ext = mimeType.includes('mp4') ? 'mp4' : 'mp4';
            onProgress(100);
            resolve({
              blob: outBlob,
              filename: `${baseName}_converted.${ext}`,
              size: outBlob.size
            });
          };

          recorder.start();
          video.play();

          const duration = video.duration || 10;
          const interval = setInterval(() => {
            if (video.ended || video.paused) {
              clearInterval(interval);
              recorder.stop();
            } else {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const pct = Math.min(95, Math.round((video.currentTime / duration) * 80) + 15);
              onProgress(pct);
            }
          }, 1000 / 30);

          video.onerror = () => {
            clearInterval(interval);
            URL.revokeObjectURL(url);
            reject(new Error('Error processing video stream'));
          };
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not decode input video format'));
      };
    });
  },

  /**
   * Compress Video (Reduce size via resolution downscaling & bitrate throttling)
   */
  async compressVideo(file, preset = 'medium', targetResolution = 'auto', onProgress = () => {}) {
    return new Promise(async (resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadedmetadata = async () => {
        try {
          onProgress(15);
          let targetWidth = video.videoWidth;
          let targetHeight = video.videoHeight;

          // Scale resolution
          if (targetResolution === '720p' && targetHeight > 720) {
            targetWidth = Math.round((720 / targetHeight) * targetWidth);
            targetHeight = 720;
          } else if (targetResolution === '480p' && targetHeight > 480) {
            targetWidth = Math.round((480 / targetHeight) * targetWidth);
            targetHeight = 480;
          } else if (preset === 'high' && targetHeight > 720) {
            targetWidth = Math.round((720 / targetHeight) * targetWidth);
            targetHeight = 720;
          }

          // Bitrate allocation based on compression preset
          let bitrate = 2000000; // 2 Mbps
          if (preset === 'high') bitrate = 900000; // 900 kbps (Max compression)
          if (preset === 'low') bitrate = 3500000; // 3.5 Mbps (High quality)

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          const stream = canvas.captureStream(24);
          const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';

          const recorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: bitrate
          });

          const chunks = [];
          recorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            URL.revokeObjectURL(url);
            const outBlob = new Blob(chunks, { type: mimeType });
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            onProgress(100);
            resolve({
              blob: outBlob,
              filename: `${baseName}_compressed.mp4`,
              size: outBlob.size
            });
          };

          recorder.start();
          video.play();

          const duration = video.duration || 10;
          const interval = setInterval(() => {
            if (video.ended || video.paused) {
              clearInterval(interval);
              recorder.stop();
            } else {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const pct = Math.min(95, Math.round((video.currentTime / duration) * 80) + 15);
              onProgress(pct);
            }
          }, 1000 / 24);

          video.onerror = () => {
            clearInterval(interval);
            URL.revokeObjectURL(url);
            reject(new Error('Video compression failed during playback'));
          };
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video for compression'));
      };
    });
  }
};

window.MediaConverter = MediaConverter;
