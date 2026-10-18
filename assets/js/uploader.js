/**
 * OmniConvert - File Uploader & Batch Queue Manager
 */
class FileQueueManager {
  constructor(options = {}) {
    this.files = []; // { id, file, status, convertedBlob, convertedName, progress, originalSize, convertedSize }
    this.container = options.container;
    this.onQueueChange = options.onQueueChange || (() => {});
    this.onConvertSingle = options.onConvertSingle || null;
    this.onConvertAll = options.onConvertAll || null;
  }

  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  addFiles(fileList) {
    const newItems = Array.from(fileList).map(file => ({
      id: 'file_' + Math.random().toString(36).substring(2, 9),
      file: file,
      name: file.name,
      originalSize: file.size,
      status: 'waiting', // waiting, processing, ready, error
      progress: 0,
      convertedBlob: null,
      convertedName: null,
      convertedSize: null,
      errorMsg: null,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    this.files = [...this.files, ...newItems];
    this.render();
    this.onQueueChange(this.files);
  }

  removeFile(id) {
    const item = this.files.find(f => f.id === id);
    if (item && item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    this.files = this.files.filter(f => f.id !== id);
    this.render();
    this.onQueueChange(this.files);
  }

  clear() {
    this.files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    this.files = [];
    this.render();
    this.onQueueChange(this.files);
  }

  updateFile(id, updates) {
    const index = this.files.findIndex(f => f.id === id);
    if (index !== -1) {
      this.files[index] = { ...this.files[index], ...updates };
      this.render();
      this.onQueueChange(this.files);
    }
  }

  downloadSingle(id) {
    const item = this.files.find(f => f.id === id);
    if (!item || !item.convertedBlob) return;
    saveAs(item.convertedBlob, item.convertedName || `converted_${item.name}`);
  }

  async downloadAllAsZip(zipFilename = 'omniconvert_bundle.zip') {
    const readyItems = this.files.filter(f => f.status === 'ready' && f.convertedBlob);
    if (readyItems.length === 0) {
      Toast.error('No converted files ready to download.');
      return;
    }

    if (readyItems.length === 1) {
      this.downloadSingle(readyItems[0].id);
      return;
    }

    if (!window.JSZip) {
      Toast.error('JSZip library not loaded');
      return;
    }

    Toast.info('Creating ZIP archive...');
    const zip = new JSZip();
    readyItems.forEach(item => {
      zip.file(item.convertedName, item.convertedBlob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipFilename);
    Toast.success('ZIP download started!');
  }

  render() {
    if (!this.container) return;

    if (this.files.length === 0) {
      this.container.innerHTML = '';
      return;
    }

    const readyCount = this.files.filter(f => f.status === 'ready').length;
    const processingCount = this.files.filter(f => f.status === 'processing').length;

    let html = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <h4 style="font-size:1.1rem; font-weight:700;">
          File Queue (${this.files.length} ${this.files.length === 1 ? 'file' : 'files'})
        </h4>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          ${readyCount > 1 ? `
            <button class="btn btn-primary btn-sm" id="btn-download-all-zip">
              <i data-lucide="archive"></i> Download All as ZIP (${readyCount})
            </button>
          ` : ''}
          <button class="btn btn-ghost btn-sm" id="btn-clear-queue" style="color:var(--accent-rose);">
            <i data-lucide="trash-2"></i> Clear All
          </button>
        </div>
      </div>
      <div class="file-list">
    `;

    this.files.forEach(item => {
      let icon = 'file';
      if (item.file.type.startsWith('image/') || item.file.name.match(/\.(jpg|jpeg|png|webp|avif|heic|svg)$/i)) icon = 'image';
      else if (item.file.type.includes('pdf') || item.file.name.endsWith('.pdf')) icon = 'file-text';
      else if (item.file.type.startsWith('video/') || item.file.name.match(/\.(mp4|mov|webm|mkv)$/i)) icon = 'video';
      else if (item.file.type.startsWith('audio/') || item.file.name.match(/\.(mp3|wav)$/i)) icon = 'music';
      else if (item.file.name.match(/\.(csv|xlsx|xls|json|xml)$/i)) icon = 'table';

      let statusBadge = `<span class="file-status-badge waiting">Waiting</span>`;
      if (item.status === 'processing') statusBadge = `<span class="file-status-badge processing"><i data-lucide="loader-2" class="spin"></i> Converting...</span>`;
      if (item.status === 'ready') statusBadge = `<span class="file-status-badge ready"><i data-lucide="check"></i> Done</span>`;
      if (item.status === 'error') statusBadge = `<span class="file-status-badge error">Failed</span>`;

      let savingsText = '';
      if (item.status === 'ready' && item.convertedSize) {
        const diff = item.originalSize - item.convertedSize;
        if (diff > 0) {
          const pct = Math.round((diff / item.originalSize) * 100);
          savingsText = `<span style="color:var(--accent-emerald); font-weight:600;">(-${pct}%)</span>`;
        }
      }

      html += `
        <div class="file-item" data-id="${item.id}">
          <div class="file-thumb">
            ${item.previewUrl ? `<img src="${item.previewUrl}" alt="preview">` : `<i data-lucide="${icon}"></i>`}
          </div>
          <div class="file-info">
            <div class="file-name" title="${item.name}">${item.name}</div>
            <div class="file-meta">
              <span>${this.formatBytes(item.originalSize)}</span>
              ${item.convertedSize ? `<span>➔ ${this.formatBytes(item.convertedSize)} ${savingsText}</span>` : ''}
              ${statusBadge}
            </div>
            <div class="progress-bar-container ${item.status === 'processing' ? 'active' : ''}">
              <div class="progress-bar-fill" style="width: ${item.progress || 50}%"></div>
            </div>
            ${item.errorMsg ? `<div style="color:var(--accent-rose); font-size:0.78rem; margin-top:0.3rem;">${item.errorMsg}</div>` : ''}
          </div>
          <div class="file-actions">
            ${item.status === 'ready' ? `
              <button class="btn btn-primary btn-sm btn-download-file" data-id="${item.id}">
                <i data-lucide="download"></i> Download
              </button>
            ` : ''}
            <button class="btn btn-ghost btn-sm btn-remove-file" data-id="${item.id}" title="Remove file">
              <i data-lucide="x"></i>
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.container.innerHTML = html;

    // Bind item buttons
    this.container.querySelectorAll('.btn-remove-file').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.removeFile(btn.dataset.id);
      };
    });

    this.container.querySelectorAll('.btn-download-file').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.downloadSingle(btn.dataset.id);
      };
    });

    const clearBtn = this.container.querySelector('#btn-clear-queue');
    if (clearBtn) clearBtn.onclick = () => this.clear();

    const zipBtn = this.container.querySelector('#btn-download-all-zip');
    if (zipBtn) zipBtn.onclick = () => this.downloadAllAsZip();

    if (window.lucide) window.lucide.createIcons();
  }
}

window.FileQueueManager = FileQueueManager;
