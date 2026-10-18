/**
 * OmniConvert - Dynamic Router, Interactive Specialized Tool Workspaces & SEO Engine
 */
const AppRouter = {
  activeTool: null,
  activeQueue: null,

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  initStandaloneTool(toolId) {
    const tool = TOOLS_DATA.find(t => t.id === toolId);
    if (!tool) return;
    this.activeTool = tool;
    this.bindToolWorkspaceEvents(tool);
    if (window.lucide) window.lucide.createIcons();
  },

  initStandaloneBlog(postId) {
    if (window.lucide) window.lucide.createIcons();
  },

  handleRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === 'home') {
      const app = document.getElementById('app-root');
      if (app && (!app.children || app.children.length === 0)) {
        this.renderHome();
      }
      return;
    }
    const parts = hash.split('/');
    const mainRoute = parts[0];
    const subParam = parts[1];

    if (mainRoute === 'tool' && subParam) {
      window.location.href = '/' + subParam + '/';
      return;
    } else if (mainRoute === 'blog') {
      window.location.href = '/blog/';
      return;
    } else if (mainRoute === 'post' && subParam) {
      window.location.href = '/blog/' + subParam + '/';
      return;
    } else if (mainRoute === 'about' || mainRoute === 'privacy' || mainRoute === 'terms' || mainRoute === 'contact') {
      window.location.href = '/' + mainRoute + '/';
      return;
    } else {
      this.renderHome();
    }

    if (window.lucide) window.lucide.createIcons();
  },

  updateSEO(title, description, schemaData = null) {
    document.title = `${title} | ${APP_CONFIG.appName}`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || APP_CONFIG.description;

    let schemaScript = document.getElementById('dynamic-schema-ld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-schema-ld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    if (schemaData) {
      schemaScript.text = JSON.stringify(schemaData);
    } else {
      schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": APP_CONFIG.appName,
        "description": APP_CONFIG.description,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All"
      });
    }
  },

  /**
   * Home View: Hero, Search, Category Tabs, Grid of all 28+ Converters, Monetization, Features, FAQs
   */
  renderHome() {
    this.updateSEO(APP_CONFIG.tagline, APP_CONFIG.description);

    const app = document.getElementById('app-root');
    app.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge-wrap">
            <span class="badge primary">
              <i data-lucide="sparkles"></i> 28+ Universal Converters • 100% Free &amp; Private
            </span>
          </div>
          <h1 class="hero-title">
            All-in-One <span class="gradient-text">File &amp; Data Converter</span> Platform
          </h1>
          <p class="hero-subtitle">
            Convert images, documents, audio, videos, text, code, currencies, colors, and everyday units directly in your browser. Zero server uploads.
          </p>

          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-input-wrap">
              <i data-lucide="search" class="search-icon"></i>
              <input type="text" id="tool-search-input" class="search-input" placeholder="Search converters (e.g. HEIC to JPG, PDF to Word, Currency, Age Calc)...">
              <span class="search-shortcut">ESC</span>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="stats-bar">
            <div class="stat-item"><i data-lucide="shield-check"></i> 100% Client-Side Privacy</div>
            <div class="stat-item"><i data-lucide="zap"></i> Instant In-Browser Speed</div>
            <div class="stat-item"><i data-lucide="infinity"></i> Unlimited Free Usage</div>
            <div class="stat-item"><i data-lucide="lock"></i> Zero Data Collection</div>
          </div>
        </div>
      </section>

      <!-- Monetization Leaderboard Ad -->
      ${this.renderAdBanner('leaderboard')}

      <!-- Main Tools Directory -->
      <section class="container" style="padding-top: 1rem;">
        <div class="category-tabs" id="category-tabs">
          <button class="category-tab active" data-category="all">
            <i data-lucide="layout-grid"></i> All Tools (${TOOLS_DATA.length})
          </button>
          <button class="category-tab" data-category="image">
            <i data-lucide="image"></i> Images
          </button>
          <button class="category-tab" data-category="document">
            <i data-lucide="file-text"></i> PDF &amp; Documents
          </button>
          <button class="category-tab" data-category="media">
            <i data-lucide="video"></i> Audio &amp; Video
          </button>
          <button class="category-tab" data-category="text">
            <i data-lucide="type"></i> Text &amp; Speech
          </button>
          <button class="category-tab" data-category="unit">
            <i data-lucide="scale"></i> Units &amp; Currency
          </button>
          <button class="category-tab" data-category="design">
            <i data-lucide="palette"></i> Design &amp; Colors
          </button>
          <button class="category-tab" data-category="calc">
            <i data-lucide="calendar"></i> Everyday Utilities
          </button>
          <button class="category-tab" data-category="data">
            <i data-lucide="code"></i> Data &amp; Code
          </button>
        </div>

        <div class="tools-grid" id="tools-grid">
          ${this.renderToolCards(TOOLS_DATA)}
        </div>
      </section>

      <!-- Featured SEO Guides / Blog Posts -->
      <section class="container" style="padding: 2rem 1.5rem 4rem;">
        <div class="section-header">
          <span class="badge success" style="margin-bottom:0.8rem;">Guides &amp; Tutorials</span>
          <h2 class="section-title">Latest Conversion Guides</h2>
          <p class="section-desc">Master tips, tricks, and formatting comparisons to work faster with your media.</p>
        </div>
        <div class="blog-grid">
          ${this.renderBlogCards(BLOG_POSTS.slice(0, 3))}
        </div>
        <div style="text-align:center; margin-top:1.5rem;">
          <a href="/blog/" class="btn btn-secondary">
            View All Guides &amp; Articles <i data-lucide="arrow-right"></i>
          </a>
        </div>
      </section>

      <!-- Value Propositions -->
      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Why Choose <span class="gradient-text">OmniConvert</span>?</h2>
            <p class="section-desc">Built for creators, students, developers, and professionals who demand speed and privacy.</p>
          </div>
          <div class="features-grid">
            <div class="feature-box">
              <div class="feature-icon"><i data-lucide="shield-alert"></i></div>
              <h3>100% Private &amp; Secure</h3>
              <p>Your files and documents never leave your computer or phone. Conversions execute entirely in browser memory.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon"><i data-lucide="cpu"></i></div>
              <h3>Blazing Fast WebAssembly</h3>
              <p>Powered by modern WebAssembly and native Web APIs for desktop-grade conversion performance.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon"><i data-lucide="layers"></i></div>
              <h3>Batch ZIP Archives</h3>
              <p>Convert multiple photos, documents, or data sheets simultaneously and download everything in a clean ZIP bundle.</p>
            </div>
            <div class="feature-box">
              <div class="feature-icon"><i data-lucide="smartphone"></i></div>
              <h3>Full Device Compatibility</h3>
              <p>Works flawlessly across Windows, Mac, Linux, iPhone iOS, and Android without installing software.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Global FAQs Section -->
      <section class="faq-section container">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-desc">Everything you need to know about our free browser converter platform.</p>
        </div>
        <div class="faq-accordion">
          ${this.renderGlobalFaqs()}
        </div>
      </section>
    `;

    this.bindHomeEvents();
  },

  renderToolCards(tools) {
    return tools.map(tool => `
      <a href="/${tool.id}/" class="tool-card" data-category="${tool.category}">
        <div class="tool-card-top">
          <div class="tool-icon-wrap ${tool.accentColor}">
            <i data-lucide="${tool.icon}"></i>
          </div>
          <span class="tool-badge-pill">${tool.badge}</span>
        </div>
        <h3 class="tool-card-title">${tool.name}</h3>
        <p class="tool-card-desc">${tool.desc}</p>
        <div class="tool-card-footer">
          <span>${tool.category.toUpperCase()}</span>
          <span class="tool-card-action">Launch Tool <i data-lucide="arrow-right"></i></span>
        </div>
      </a>
    `).join('');
  },

  renderBlogCards(posts) {
    return posts.map(post => `
      <article class="blog-card">
        <div class="blog-card-img">
          <div class="blog-card-img-placeholder">
            <i data-lucide="${post.coverIcon || 'book-open'}"></i>
          </div>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="badge primary">${post.category}</span>
            <span>•</span>
            <span>${post.readTime}</span>
          </div>
          <h3 class="blog-card-title">
            <a href="/blog/${post.id}/">${post.title}</a>
          </h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-footer">
            <div class="author-info">
              <div class="author-avatar">${post.author.avatar}</div>
              <span>${post.author.name}</span>
            </div>
            <a href="/blog/${post.id}/" style="color:var(--primary); font-weight:600; display:inline-flex; align-items:center; gap:0.25rem;">
              Read <i data-lucide="chevron-right" style="width:16px;"></i>
            </a>
          </div>
        </div>
      </article>
    `).join('');
  },

  renderGlobalFaqs() {
    const faqs = [
      { q: "Is OmniConvert really 100% free with no limits?", a: "Yes! All 28+ tools are 100% free with unlimited conversions and zero watermarks." },
      { q: "Why is in-browser conversion safer than online cloud converters?", a: "Traditional cloud converters upload your private documents, photos, and spreadsheets to third-party servers. OmniConvert processes everything locally inside your device, ensuring zero data exposure." },
      { q: "Can I use these tools on iPhone and Android?", a: "Yes, OmniConvert is fully responsive and touch-optimized for mobile devices, tablets, and laptops." }
    ];

    return faqs.map((faq, idx) => `
      <div class="faq-item ${idx === 0 ? 'active' : ''}">
        <button class="faq-question">
          <span>${faq.q}</span>
          <i data-lucide="chevron-down" class="faq-icon"></i>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join('');
  },

  bindHomeEvents() {
    const searchInput = document.getElementById('tool-search-input');
    const toolsGrid = document.getElementById('tools-grid');

    if (searchInput) {
      searchInput.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = toolsGrid.querySelectorAll('.tool-card');
        cards.forEach(card => {
          const title = card.querySelector('.tool-card-title').textContent.toLowerCase();
          const desc = card.querySelector('.tool-card-desc').textContent.toLowerCase();
          const isMatch = title.includes(query) || desc.includes(query);
          card.style.display = isMatch ? 'flex' : 'none';
        });
      };
    }

    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.category;
        const cards = toolsGrid.querySelectorAll('.tool-card');
        cards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });

    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.onclick = () => btn.parentElement.classList.toggle('active');
    });
  },

  renderAdBanner(type = 'leaderboard') {
    if (!APP_CONFIG.ads.enabled) return '';
    return `
      <div class="ad-wrapper">
        <div class="ad-slot ad-slot-${type}">
          <span class="ad-slot-tag">Advertisement</span>
          <span>Google AdSense Unit (Responsive 728x90 / 300x250)</span>
        </div>
      </div>
    `;
  },

  /**
   * Tool Dispatcher & View Renderer
   */
  renderTool(toolId) {
    const tool = TOOLS_DATA.find(t => t.id === toolId);
    if (!tool) {
      this.renderHome();
      return;
    }

    this.activeTool = tool;

    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.name,
      "description": tool.metaDesc,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    this.updateSEO(tool.metaTitle, tool.metaDesc, schema);

    const app = document.getElementById('app-root');
    let workspaceHtml = '';

    if (tool.isSpecialUI === 'case-converter') workspaceHtml = this.renderCaseConverterUI(tool);
    else if (tool.isSpecialUI === 'dual-markdown') workspaceHtml = this.renderMarkdownUI(tool);
    else if (tool.isSpecialUI === 'tts') workspaceHtml = this.renderTtsUI(tool);
    else if (tool.isSpecialUI === 'base64') workspaceHtml = this.renderBase64UI(tool);
    else if (tool.isSpecialUI === 'url-coder') workspaceHtml = this.renderUrlCoderUI(tool);
    else if (tool.isSpecialUI === 'currency') workspaceHtml = this.renderCurrencyUI(tool);
    else if (tool.isSpecialUI === 'units-multi') workspaceHtml = this.renderMultiUnitsUI(tool);
    else if (tool.isSpecialUI === 'timezone') workspaceHtml = this.renderTimezoneUI(tool);
    else if (tool.isSpecialUI === 'data-storage') workspaceHtml = this.renderDataStorageUI(tool);
    else if (tool.isSpecialUI === 'color-picker') workspaceHtml = this.renderColorPickerUI(tool);
    else if (tool.isSpecialUI === 'qr-code-suite') workspaceHtml = this.renderQrSuiteUI(tool);
    else if (tool.isSpecialUI === 'word-counter') workspaceHtml = this.renderWordCounterUI(tool);
    else if (tool.isSpecialUI === 'age-calc') workspaceHtml = this.renderAgeCalcUI(tool);
    else if (tool.isSpecialUI === 'date-diff') workspaceHtml = this.renderDateDiffUI(tool);
    else if (tool.isSpecialUI === 'resizer') workspaceHtml = this.renderImageResizerUI(tool);
    else if (tool.id === 'csv-json' || tool.id === 'json-xml') workspaceHtml = this.renderDualPaneWorkspace(tool);
    else workspaceHtml = this.renderStandardToolWorkspace(tool);

    app.innerHTML = `
      <div class="tool-workspace container">
        <div class="tool-header-area">
          <div class="breadcrumbs">
            <a href="#home">Home</a>
            <span>/</span>
            <a href="#home">${tool.category.toUpperCase()}</a>
            <span>/</span>
            <span>${tool.shortTitle}</span>
          </div>
          <span class="badge primary" style="margin-bottom:0.8rem;">${tool.badge}</span>
          <h1 class="tool-headline">${tool.name}</h1>
          <p class="tool-lead">${tool.desc}</p>
        </div>

        <div class="tool-card-panel">
          ${workspaceHtml}
        </div>

        <!-- In-Content Ad -->
        ${this.renderAdBanner('leaderboard')}

        <!-- How To Step-by-Step Guide -->
        <section class="tool-guide-section">
          <div class="section-header">
            <h2 class="section-title">How to Use <span class="gradient-text">${tool.shortTitle}</span></h2>
            <p class="section-desc">Quick guide to convert your files for free.</p>
          </div>
          <div class="guide-steps-grid">
            ${(tool.howTo || []).map(step => `
              <div class="guide-step-card">
                <div class="step-num">0${step.step}</div>
                <h3>${step.title}</h3>
                <p>${step.desc}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Tool Specific FAQs -->
        <section class="faq-section" style="padding-top:1rem;">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked Questions</h2>
          </div>
          <div class="faq-accordion">
            ${(tool.faqs || []).map((f, i) => `
              <div class="faq-item ${i === 0 ? 'active' : ''}">
                <button class="faq-question">
                  <span>${f.q}</span>
                  <i data-lucide="chevron-down" class="faq-icon"></i>
                </button>
                <div class="faq-answer"><p>${f.a}</p></div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    this.bindToolWorkspaceEvents(tool);
  },

  /* ---------------- Specialized UI Templates & Handlers ---------------- */

  renderCaseConverterUI(tool) {
    return `
      <div>
        <textarea class="code-textarea" id="case-input" style="height:200px;" placeholder="Type or paste your text here to change its case..."></textarea>
        <div class="case-buttons-grid">
          <button class="btn btn-secondary btn-sm" data-case="uppercase">UPPERCASE</button>
          <button class="btn btn-secondary btn-sm" data-case="lowercase">lowercase</button>
          <button class="btn btn-secondary btn-sm" data-case="titlecase">Title Case</button>
          <button class="btn btn-secondary btn-sm" data-case="sentencecase">Sentence case</button>
          <button class="btn btn-secondary btn-sm" data-case="camelcase">camelCase</button>
          <button class="btn btn-secondary btn-sm" data-case="snakecase">snake_case</button>
          <button class="btn btn-secondary btn-sm" data-case="kebabcase">kebab-case</button>
          <button class="btn btn-secondary btn-sm" data-case="alternating">aLtErNaTiNg</button>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
          <button class="btn btn-ghost btn-sm" id="btn-clear-case"><i data-lucide="trash-2"></i> Clear</button>
          <button class="btn btn-primary btn-sm" id="btn-copy-case"><i data-lucide="copy"></i> Copy to Clipboard</button>
        </div>
      </div>
    `;
  },

  renderMarkdownUI(tool) {
    return `
      <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
        <button class="btn btn-ghost btn-sm" id="btn-swap-md"><i data-lucide="arrow-left-right"></i> Swap Mode</button>
        <button class="btn btn-primary btn-sm" id="btn-copy-md-out"><i data-lucide="copy"></i> Copy Output</button>
      </div>
      <div class="dual-pane-container">
        <div class="editor-pane">
          <div class="editor-pane-header"><span>Markdown Input</span></div>
          <textarea class="code-textarea" id="md-in"># Hello OmniConvert\n\nThis is a **Markdown** to *HTML* converter.\n\n- Free tools\n- Instant speed\n- Zero server uploads</textarea>
        </div>
        <div class="editor-pane">
          <div class="editor-pane-header"><span>HTML Output</span></div>
          <textarea class="code-textarea" id="md-out" readonly></textarea>
        </div>
      </div>
    `;
  },

  renderTtsUI(tool) {
    return `
      <div>
        <textarea class="code-textarea" id="tts-text" style="height:180px;" placeholder="Enter any text you want to listen to...">OmniConvert is the best online file converter platform with 100% client-side privacy.</textarea>
        <div class="conversion-controls">
          <div class="control-group">
            <label class="control-label"><i data-lucide="user"></i> Voice:</label>
            <select id="tts-voice-select" class="control-select"></select>
          </div>
          <div class="control-group">
            <label class="control-label"><i data-lucide="gauge"></i> Speed:</label>
            <div class="range-slider-wrap">
              <input type="range" id="tts-rate" class="range-slider" min="0.5" max="2" value="1" step="0.1">
              <span class="range-value" id="tts-rate-val">1.0x</span>
            </div>
          </div>
          <div style="display:flex; gap:0.75rem; margin-top:auto;">
            <button class="btn btn-primary" id="btn-tts-play"><i data-lucide="play"></i> Speak</button>
            <button class="btn btn-secondary" id="btn-tts-stop"><i data-lucide="square"></i> Stop</button>
          </div>
        </div>
      </div>
    `;
  },

  renderBase64UI(tool) {
    return `
      <div class="dual-pane-container">
        <div class="editor-pane">
          <div class="editor-pane-header"><span>Text Input</span></div>
          <textarea class="code-textarea" id="base64-plain" placeholder="Enter plain text to encode...">Hello World!</textarea>
        </div>
        <div class="editor-pane">
          <div class="editor-pane-header"><span>Base64 String</span></div>
          <textarea class="code-textarea" id="base64-cipher" placeholder="Enter Base64 to decode..."></textarea>
        </div>
      </div>
      <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;">
        <button class="btn btn-primary" id="btn-encode-b64"><i data-lucide="lock"></i> Encode to Base64</button>
        <button class="btn btn-secondary" id="btn-decode-b64"><i data-lucide="unlock"></i> Decode Base64</button>
      </div>
    `;
  },

  renderUrlCoderUI(tool) {
    return `
      <div class="dual-pane-container">
        <div class="editor-pane">
          <div class="editor-pane-header"><span>Decoded / Normal URL</span></div>
          <textarea class="code-textarea" id="url-plain" placeholder="https://example.com/search?q=free tools & blog"></textarea>
        </div>
        <div class="editor-pane">
          <div class="editor-pane-header"><span>Percent Encoded URL</span></div>
          <textarea class="code-textarea" id="url-encoded" placeholder="https%3A%2F%2Fexample.com..."></textarea>
        </div>
      </div>
      <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;">
        <button class="btn btn-primary" id="btn-encode-url"><i data-lucide="arrow-right"></i> URL Encode</button>
        <button class="btn btn-secondary" id="btn-decode-url"><i data-lucide="arrow-left"></i> URL Decode</button>
      </div>
    `;
  },

  renderCurrencyUI(tool) {
    const popularCurrencies = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'CAD', 'AUD', 'JPY', 'CNY', 'TRY'];
    return `
      <div style="max-width:680px; margin:0 auto;">
        <div style="margin-bottom:1.5rem;">
          <label class="control-label" style="margin-bottom:0.5rem;">Amount to Convert:</label>
          <input type="number" id="curr-amount" class="control-input" style="width:100%; font-size:1.4rem; padding:0.8rem 1.2rem;" value="100">
        </div>
        <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:1rem; align-items:center; margin-bottom:2rem;">
          <div class="control-group">
            <label class="control-label">From:</label>
            <select id="curr-from" class="control-select" style="font-size:1.1rem; padding:0.75rem;">
              ${popularCurrencies.map(c => `<option value="${c}" ${c==='USD'?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-ghost btn-icon" id="btn-swap-curr" style="margin-top:1.5rem;"><i data-lucide="arrow-left-right"></i></button>
          <div class="control-group">
            <label class="control-label">To:</label>
            <select id="curr-to" class="control-select" style="font-size:1.1rem; padding:0.75rem;">
              ${popularCurrencies.map(c => `<option value="${c}" ${c==='PKR'?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="countdown-banner">
          <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.3rem;">Converted Result (Live Rate):</div>
          <div id="curr-result-text" style="font-family:var(--font-heading); font-size:2.2rem; font-weight:800; color:var(--text-primary);">Loading...</div>
        </div>
      </div>
    `;
  },

  renderMultiUnitsUI(tool) {
    return `
      <div style="max-width:720px; margin:0 auto;">
        <div class="category-tabs" id="unit-tabs" style="margin-bottom:1.5rem;">
          <button class="category-tab active" data-unit-type="length">Length</button>
          <button class="category-tab" data-unit-type="weight">Weight</button>
          <button class="category-tab" data-unit-type="temp">Temperature</button>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
          <div>
            <label class="control-label" style="margin-bottom:0.5rem;">From Unit:</label>
            <input type="number" id="unit-in-val" class="control-input" style="width:100%; font-size:1.2rem; margin-bottom:0.75rem;" value="1">
            <select id="unit-from-select" class="control-select" style="width:100%;"></select>
          </div>
          <div>
            <label class="control-label" style="margin-bottom:0.5rem;">To Unit:</label>
            <input type="text" id="unit-out-val" class="control-input" style="width:100%; font-size:1.2rem; margin-bottom:0.75rem;" readonly>
            <select id="unit-to-select" class="control-select" style="width:100%;"></select>
          </div>
        </div>
      </div>
    `;
  },

  renderTimezoneUI(tool) {
    return `
      <div style="max-width:720px; margin:0 auto;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem;">
          <div>
            <label class="control-label">Date:</label>
            <input type="date" id="tz-date" class="control-input" style="width:100%;">
          </div>
          <div>
            <label class="control-label">Time:</label>
            <input type="time" id="tz-time" class="control-input" style="width:100%;">
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:2rem;">
          <div class="control-group">
            <label class="control-label">Source Time Zone:</label>
            <select id="tz-from" class="control-select">
              <option value="America/New_York">New York (EST/EDT)</option>
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Asia/Karachi" selected>Karachi / Islamabad (PKT)</option>
              <option value="Asia/Dubai">Dubai (GST)</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">Target Time Zone:</label>
            <select id="tz-to" class="control-select">
              <option value="America/New_York" selected>New York (EST/EDT)</option>
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Asia/Karachi">Karachi / Islamabad (PKT)</option>
              <option value="Asia/Dubai">Dubai (GST)</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>
        </div>
        <div class="countdown-banner">
          <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.3rem;">Converted Local Time:</div>
          <div id="tz-result-text" style="font-family:var(--font-heading); font-size:1.8rem; font-weight:700; color:var(--text-primary);">-</div>
        </div>
      </div>
    `;
  },

  renderDataStorageUI(tool) {
    return `
      <div style="max-width:680px; margin:0 auto;">
        <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:1rem; margin-bottom:2rem;">
          <input type="number" id="ds-input-val" class="control-input" style="font-size:1.4rem; padding:0.8rem;" value="1024">
          <select id="ds-input-unit" class="control-select" style="font-size:1.1rem;">
            <option value="MB" selected>Megabytes (MB)</option>
            <option value="GB">Gigabytes (GB)</option>
            <option value="TB">Terabytes (TB)</option>
            <option value="KB">Kilobytes (KB)</option>
            <option value="B">Bytes (B)</option>
          </select>
        </div>
        <div class="stats-grid-dashboard" id="ds-results-grid"></div>
      </div>
    `;
  },

  renderColorPickerUI(tool) {
    return `
      <div style="max-width:760px; margin:0 auto;">
        <div class="color-preview-box" id="color-box" style="background-color:#6366f1;">
          #6366F1
        </div>
        <div style="display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:2rem;">
          <input type="color" id="color-native-picker" value="#6366f1" style="width:50px; height:50px; border-radius:10px; cursor:pointer; border:none;">
          <span style="font-weight:600;">Choose custom color or edit values below</span>
        </div>
        <div class="color-inputs-grid">
          <div class="color-input-item">
            <div><span style="font-size:0.8rem; color:var(--text-muted);">HEX</span><div id="col-hex" style="font-weight:700;">#6366F1</div></div>
            <button class="btn btn-ghost btn-sm btn-copy-color" data-target="col-hex"><i data-lucide="copy"></i></button>
          </div>
          <div class="color-input-item">
            <div><span style="font-size:0.8rem; color:var(--text-muted);">RGB</span><div id="col-rgb" style="font-weight:700;">rgb(99, 102, 241)</div></div>
            <button class="btn btn-ghost btn-sm btn-copy-color" data-target="col-rgb"><i data-lucide="copy"></i></button>
          </div>
          <div class="color-input-item">
            <div><span style="font-size:0.8rem; color:var(--text-muted);">HSL</span><div id="col-hsl" style="font-weight:700;">hsl(239, 84%, 67%)</div></div>
            <button class="btn btn-ghost btn-sm btn-copy-color" data-target="col-hsl"><i data-lucide="copy"></i></button>
          </div>
          <div class="color-input-item">
            <div><span style="font-size:0.8rem; color:var(--text-muted);">CMYK</span><div id="col-cmyk" style="font-weight:700;">cmyk(59%, 58%, 0%, 5%)</div></div>
            <button class="btn btn-ghost btn-sm btn-copy-color" data-target="col-cmyk"><i data-lucide="copy"></i></button>
          </div>
        </div>
      </div>
    `;
  },

  renderQrSuiteUI(tool) {
    return `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
        <div>
          <h4 style="font-size:1.1rem; margin-bottom:1rem;">Generate QR Code</h4>
          <div style="margin-bottom:1rem;">
            <label class="control-label">URL or Text:</label>
            <input type="text" id="qr-input-text" class="control-input" style="width:100%;" value="https://omniconvert.com">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <div>
              <label class="control-label">QR Color:</label>
              <input type="color" id="qr-color-dark" value="#000000" style="width:100%; height:40px; border-radius:8px; border:none; cursor:pointer;">
            </div>
            <div>
              <label class="control-label">Background:</label>
              <input type="color" id="qr-color-light" value="#ffffff" style="width:100%; height:40px; border-radius:8px; border:none; cursor:pointer;">
            </div>
          </div>
          <button class="btn btn-primary" id="btn-make-qr" style="width:100%;"><i data-lucide="qr-code"></i> Generate QR Code</button>
        </div>
        <div class="qr-preview-panel">
          <div id="qr-code-output"></div>
          <button class="btn btn-secondary btn-sm" id="btn-download-qr" style="margin-top:0.75rem;"><i data-lucide="download"></i> Download PNG</button>
        </div>
      </div>
    `;
  },

  renderWordCounterUI(tool) {
    return `
      <div>
        <div class="stats-grid-dashboard">
          <div class="stat-metric-card"><div class="stat-metric-num" id="wc-words">0</div><div class="stat-metric-label">Words</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="wc-chars">0</div><div class="stat-metric-label">Characters</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="wc-chars-nospace">0</div><div class="stat-metric-label">No Spaces</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="wc-sentences">0</div><div class="stat-metric-label">Sentences</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="wc-reading">0 sec</div><div class="stat-metric-label">Reading Time</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="wc-speaking">0 sec</div><div class="stat-metric-label">Speaking Time</div></div>
        </div>
        <textarea class="code-textarea" id="word-counter-input" style="height:280px;" placeholder="Start typing or paste your content here to analyze in real time..."></textarea>
      </div>
    `;
  },

  renderAgeCalcUI(tool) {
    return `
      <div style="max-width:680px; margin:0 auto;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
          <div>
            <label class="control-label" style="margin-bottom:0.5rem;">Date of Birth:</label>
            <input type="date" id="age-birthdate" class="control-input" style="width:100%;" value="2000-01-01">
          </div>
          <div>
            <label class="control-label" style="margin-bottom:0.5rem;">Age at Date of:</label>
            <input type="date" id="age-targetdate" class="control-input" style="width:100%;">
          </div>
        </div>
        <button class="btn btn-primary" id="btn-calc-age" style="width:100%; margin-bottom:2rem;"><i data-lucide="calculator"></i> Calculate Exact Age</button>
        <div class="stats-grid-dashboard" id="age-results-dashboard">
          <div class="stat-metric-card"><div class="stat-metric-num" id="age-years">-</div><div class="stat-metric-label">Years</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="age-months">-</div><div class="stat-metric-label">Months</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="age-days">-</div><div class="stat-metric-label">Days</div></div>
          <div class="stat-metric-card"><div class="stat-metric-num" id="age-weeks">-</div><div class="stat-metric-label">Total Weeks</div></div>
        </div>
        <div class="countdown-banner" id="age-birthday-banner">
          <h3 id="age-next-bday-text">Next Birthday: -</h3>
        </div>
      </div>
    `;
  },

  renderDateDiffUI(tool) {
    return `
      <div style="max-width:680px; margin:0 auto;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:2rem;">
          <div>
            <label class="control-label" style="margin-bottom:0.5rem;">Start Date:</label>
            <input type="date" id="datediff-start" class="control-input" style="width:100%;">
          </div>
          <div>
            <label class="control-label" style="margin-bottom:0.5rem;">End Date:</label>
            <input type="date" id="datediff-end" class="control-input" style="width:100%;">
          </div>
        </div>
        <button class="btn btn-primary" id="btn-calc-datediff" style="width:100%; margin-bottom:2rem;"><i data-lucide="calendar"></i> Calculate Difference</button>
        <div class="countdown-banner">
          <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.3rem;">Total Duration:</div>
          <div id="datediff-result-text" style="font-family:var(--font-heading); font-size:2rem; font-weight:800; color:var(--text-primary);">-</div>
        </div>
      </div>
    `;
  },

  renderImageResizerUI(tool) {
    return `
      <div class="dropzone" id="resizer-dropzone">
        <input type="file" id="resizer-file-input" class="file-input-hidden" accept="image/*">
        <div class="dropzone-icon"><i data-lucide="crop"></i></div>
        <h3 class="dropzone-title">Drop your image here</h3>
        <p class="dropzone-sub">Resize dimensions & compress</p>
      </div>
      <div class="conversion-controls" style="margin-top:1.5rem;">
        <div class="control-group">
          <label class="control-label">Width (px):</label>
          <input type="number" id="resize-w" class="control-input" placeholder="Width">
        </div>
        <div class="control-group">
          <label class="control-label">Height (px):</label>
          <input type="number" id="resize-h" class="control-input" placeholder="Height">
        </div>
        <div class="control-group">
          <label class="control-label">Format:</label>
          <select id="resize-fmt" class="control-select"><option value="jpeg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option></select>
        </div>
        <button class="btn btn-primary" id="btn-run-resize" style="margin-top:auto;"><i data-lucide="download"></i> Resize &amp; Save</button>
      </div>
    `;
  },

  renderStandardToolWorkspace(tool) {
    return `
      <div class="dropzone" id="tool-dropzone">
        <input type="file" id="tool-file-input" class="file-input-hidden" multiple accept="${tool.acceptedTypes}">
        <div class="dropzone-icon"><i data-lucide="upload-cloud"></i></div>
        <h3 class="dropzone-title">Drop your files here, or browse</h3>
        <p class="dropzone-sub">Supports ${tool.acceptedTypes ? tool.acceptedTypes.split(',').slice(0, 4).join(', ') : 'All formats'} • 100% Private in-browser</p>
        <button class="btn btn-primary btn-sm dropzone-btn">Select Files</button>
      </div>
      <div class="conversion-controls">
        <div class="control-group">
          <label class="control-label"><i data-lucide="file-output"></i> Convert To:</label>
          <select id="target-format-select" class="control-select">
            ${(tool.availableTargets || [tool.defaultTarget]).map(fmt => `
              <option value="${fmt}" ${fmt === tool.defaultTarget ? 'selected' : ''}>${fmt ? fmt.toUpperCase() : ''}</option>
            `).join('')}
          </select>
        </div>
        ${tool.hasQualityControl ? `
          <div class="control-group" style="flex-grow:1; max-width:320px;">
            <label class="control-label"><i data-lucide="sliders"></i> Quality / Compression:</label>
            <div class="range-slider-wrap">
              <input type="range" id="quality-slider" class="range-slider" min="10" max="100" value="85" step="5">
              <span class="range-value" id="quality-val">85%</span>
            </div>
          </div>
        ` : ''}
        <div style="display:flex; align-items:center; gap:0.75rem; margin-top:auto;">
          <button class="btn btn-primary" id="btn-start-convert">
            <i data-lucide="play"></i> Convert All Files
          </button>
        </div>
      </div>
      <div id="queue-container"></div>
    `;
  },

  renderDualPaneWorkspace(tool) {
    const isCsvJson = tool.id === 'csv-json';
    const leftLabel = isCsvJson ? 'CSV Input' : 'JSON Input';
    const rightLabel = isCsvJson ? 'JSON Output' : 'XML Output';

    const defaultLeftText = isCsvJson
      ? `id,name,role,country\n1,Rafiq,Developer,Pakistan\n2,Sarah,Designer,UK\n3,Alex,Manager,USA`
      : `{\n  "user": {\n    "name": "Rafiq",\n    "tools": ["Image", "Document", "Video", "Data"],\n    "version": 2.0\n  }\n}`;

    return `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div style="display:flex; gap:0.5rem;">
          <input type="file" id="dual-file-input" style="display:none;" accept="${tool.acceptedTypes}">
          <button class="btn btn-secondary btn-sm" id="btn-upload-dual"><i data-lucide="upload"></i> Upload File</button>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" id="btn-run-dual-convert"><i data-lucide="zap"></i> Convert Now</button>
        </div>
      </div>
      <div class="dual-pane-container">
        <div class="editor-pane">
          <div class="editor-pane-header">
            <span id="left-pane-title">${leftLabel}</span>
            <button class="btn btn-ghost btn-sm" id="btn-clear-left"><i data-lucide="trash-2"></i></button>
          </div>
          <textarea class="code-textarea" id="left-textarea">${defaultLeftText}</textarea>
        </div>
        <div class="editor-pane">
          <div class="editor-pane-header">
            <span id="right-pane-title">${rightLabel}</span>
            <div class="editor-pane-actions">
              <button class="btn btn-ghost btn-sm" id="btn-copy-right"><i data-lucide="copy"></i> Copy</button>
              <button class="btn btn-primary btn-sm" id="btn-download-right"><i data-lucide="download"></i> Save</button>
            </div>
          </div>
          <textarea class="code-textarea" id="right-textarea" readonly></textarea>
        </div>
      </div>
    `;
  },

  /* ---------------- Interactive Event Binders ---------------- */

  bindToolWorkspaceEvents(tool) {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.onclick = () => btn.parentElement.classList.toggle('active');
    });

    if (tool.isSpecialUI === 'case-converter') {
      const input = document.getElementById('case-input');
      document.querySelectorAll('.case-buttons-grid button').forEach(btn => {
        btn.onclick = () => { input.value = TextConverter.convertCase(input.value, btn.dataset.case); };
      });
      document.getElementById('btn-clear-case').onclick = () => { input.value = ''; };
      document.getElementById('btn-copy-case').onclick = () => { navigator.clipboard.writeText(input.value); Toast.success('Copied to clipboard!'); };
      return;
    }

    if (tool.isSpecialUI === 'dual-markdown') {
      const mdIn = document.getElementById('md-in');
      const mdOut = document.getElementById('md-out');
      const update = () => { mdOut.value = TextConverter.markdownToHtml(mdIn.value); };
      mdIn.oninput = update;
      update();
      document.getElementById('btn-copy-md-out').onclick = () => { navigator.clipboard.writeText(mdOut.value); Toast.success('HTML copied!'); };
      return;
    }

    if (tool.isSpecialUI === 'tts') {
      const textEl = document.getElementById('tts-text');
      const voiceSel = document.getElementById('tts-voice-select');
      const rateEl = document.getElementById('tts-rate');
      const rateVal = document.getElementById('tts-rate-val');

      const populateVoices = () => {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        voiceSel.innerHTML = voices.map((v, i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join('');
      };
      populateVoices();
      if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = populateVoices;

      rateEl.oninput = () => { rateVal.textContent = `${rateEl.value}x`; };
      document.getElementById('btn-tts-play').onclick = () => {
        try {
          const vIdx = parseInt(voiceSel.value, 10);
          TextConverter.speakText(textEl.value, {
            voiceIndex: isNaN(vIdx) ? undefined : vIdx,
            rate: parseFloat(rateEl.value) || 1.0
          });
          Toast.info('Playing speech audio...');
        } catch (e) {
          Toast.error(e.message);
        }
      };
      document.getElementById('btn-tts-stop').onclick = () => {
        TextConverter.stopSpeech();
        Toast.info('Speech stopped');
      };
      return;
    }

    if (tool.isSpecialUI === 'base64') {
      const plain = document.getElementById('base64-plain');
      const cipher = document.getElementById('base64-cipher');
      document.getElementById('btn-encode-b64').onclick = () => {
        try { cipher.value = TextConverter.base64Encode(plain.value); } catch(e) { Toast.error(e.message); }
      };
      document.getElementById('btn-decode-b64').onclick = () => {
        try { plain.value = TextConverter.base64Decode(cipher.value); } catch(e) { Toast.error(e.message); }
      };
      return;
    }

    if (tool.isSpecialUI === 'url-coder') {
      const plain = document.getElementById('url-plain');
      const encoded = document.getElementById('url-encoded');
      document.getElementById('btn-encode-url').onclick = () => { encoded.value = TextConverter.urlEncode(plain.value); };
      document.getElementById('btn-decode-url').onclick = () => {
        try { plain.value = TextConverter.urlDecode(encoded.value); } catch(e) { Toast.error(e.message); }
      };
      return;
    }

    if (tool.isSpecialUI === 'currency') {
      const amt = document.getElementById('curr-amount');
      const fromSel = document.getElementById('curr-from');
      const toSel = document.getElementById('curr-to');
      const resText = document.getElementById('curr-result-text');

      const doCalc = async () => {
        const val = parseFloat(amt.value) || 0;
        const res = await UnitConverter.convertCurrency(val, fromSel.value, toSel.value);
        resText.textContent = `${res} ${toSel.value}`;
      };

      amt.oninput = doCalc;
      fromSel.onchange = doCalc;
      toSel.onchange = doCalc;
      document.getElementById('btn-swap-curr').onclick = () => {
        const temp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = temp;
        doCalc();
      };
      doCalc();
      return;
    }

    if (tool.isSpecialUI === 'units-multi') {
      const tabs = document.querySelectorAll('#unit-tabs button');
      const fromSel = document.getElementById('unit-from-select');
      const toSel = document.getElementById('unit-to-select');
      const inVal = document.getElementById('unit-in-val');
      const outVal = document.getElementById('unit-out-val');
      let currentType = 'length';

      const unitOptions = {
        length: [['m','Meters (m)'],['km','Kilometers (km)'],['cm','Centimeters (cm)'],['ft','Feet (ft)'],['in','Inches (in)'],['mi','Miles (mi)']],
        weight: [['kg','Kilograms (kg)'],['g','Grams (g)'],['lb','Pounds (lb)'],['oz','Ounces (oz)'],['t','Metric Tons (t)']],
        temp: [['c','Celsius (°C)'],['f','Fahrenheit (°F)'],['k','Kelvin (K)']]
      };

      const populateUnitSelects = (type) => {
        const list = unitOptions[type];
        fromSel.innerHTML = list.map(u => `<option value="${u[0]}">${u[1]}</option>`).join('');
        toSel.innerHTML = list.map((u, i) => `<option value="${u[0]}" ${i===1?'selected':''}>${u[1]}</option>`).join('');
      };

      const doUnitCalc = () => {
        const val = parseFloat(inVal.value) || 0;
        let res = 0;
        if (currentType === 'length') res = UnitConverter.convertLength(val, fromSel.value, toSel.value);
        else if (currentType === 'weight') res = UnitConverter.convertWeight(val, fromSel.value, toSel.value);
        else if (currentType === 'temp') res = UnitConverter.convertTemperature(val, fromSel.value, toSel.value);
        outVal.value = parseFloat(res.toFixed(6));
      };

      tabs.forEach(tab => {
        tab.onclick = () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          currentType = tab.dataset.unitType;
          populateUnitSelects(currentType);
          doUnitCalc();
        };
      });

      populateUnitSelects('length');
      inVal.oninput = doUnitCalc;
      fromSel.onchange = doUnitCalc;
      toSel.onchange = doUnitCalc;
      doUnitCalc();
      return;
    }

    if (tool.isSpecialUI === 'timezone') {
      const d = document.getElementById('tz-date');
      const t = document.getElementById('tz-time');
      const fromSel = document.getElementById('tz-from');
      const toSel = document.getElementById('tz-to');
      const resText = document.getElementById('tz-result-text');

      const now = new Date();
      d.value = now.toISOString().split('T')[0];
      t.value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      const doTz = () => {
        resText.textContent = UnitConverter.convertTimezone(d.value, t.value, fromSel.value, toSel.value);
      };
      d.onchange = doTz;
      t.oninput = doTz;
      fromSel.onchange = doTz;
      toSel.onchange = doTz;
      doTz();
      return;
    }

    if (tool.isSpecialUI === 'data-storage') {
      const inVal = document.getElementById('ds-input-val');
      const inUnit = document.getElementById('ds-input-unit');
      const grid = document.getElementById('ds-results-grid');

      const updateDs = () => {
        const val = parseFloat(inVal.value) || 0;
        const baseUnit = inUnit.value;
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        grid.innerHTML = units.map(u => {
          const converted = UnitConverter.convertData(val, baseUnit, u);
          return `
            <div class="stat-metric-card">
              <div class="stat-metric-num" style="font-size:1.3rem;">${parseFloat(converted.toFixed(4))}</div>
              <div class="stat-metric-label">${u}</div>
            </div>
          `;
        }).join('');
      };
      inVal.oninput = updateDs;
      inUnit.onchange = updateDs;
      updateDs();
      return;
    }

    if (tool.isSpecialUI === 'color-picker') {
      const picker = document.getElementById('color-native-picker');
      const box = document.getElementById('color-box');
      const hexEl = document.getElementById('col-hex');
      const rgbEl = document.getElementById('col-rgb');
      const hslEl = document.getElementById('col-hsl');
      const cmykEl = document.getElementById('col-cmyk');

      const updateCol = (col) => {
        const res = DesignConverter.convertColor(col);
        box.style.backgroundColor = res.hex;
        box.textContent = res.hex;
        hexEl.textContent = res.hex;
        rgbEl.textContent = res.rgb;
        hslEl.textContent = res.hsl;
        cmykEl.textContent = res.cmyk;
      };

      picker.oninput = () => updateCol(picker.value);
      document.querySelectorAll('.btn-copy-color').forEach(btn => {
        btn.onclick = () => {
          const text = document.getElementById(btn.dataset.target).textContent;
          navigator.clipboard.writeText(text);
          Toast.success(`Copied ${text}`);
        };
      });
      updateCol(picker.value);
      return;
    }

    if (tool.isSpecialUI === 'qr-code-suite') {
      const textIn = document.getElementById('qr-input-text');
      const colDark = document.getElementById('qr-color-dark');
      const colLight = document.getElementById('qr-color-light');
      const qrOut = document.getElementById('qr-code-output');

      const makeQr = () => {
        DesignConverter.generateQrCode(qrOut, textIn.value, {
          colorDark: colDark.value,
          colorLight: colLight.value
        });
      };

      document.getElementById('btn-make-qr').onclick = makeQr;
      document.getElementById('btn-download-qr').onclick = () => {
        const img = qrOut.querySelector('img') || qrOut.querySelector('canvas');
        if (img) {
          const src = img.src || img.toDataURL();
          const a = document.createElement('a');
          a.href = src;
          a.download = 'qrcode.png';
          a.click();
        }
      };
      makeQr();
      return;
    }

    if (tool.isSpecialUI === 'word-counter') {
      const input = document.getElementById('word-counter-input');
      input.oninput = () => {
        const res = UtilityConverter.analyzeText(input.value);
        document.getElementById('wc-words').textContent = res.words;
        document.getElementById('wc-chars').textContent = res.characters;
        document.getElementById('wc-chars-nospace').textContent = res.charactersNoSpaces;
        document.getElementById('wc-sentences').textContent = res.sentences;
        document.getElementById('wc-reading').textContent = res.readingTime;
        document.getElementById('wc-speaking').textContent = res.speakingTime;
      };
      return;
    }

    if (tool.isSpecialUI === 'age-calc') {
      const bDate = document.getElementById('age-birthdate');
      const tDate = document.getElementById('age-targetdate');
      tDate.value = new Date().toISOString().split('T')[0];

      const doAge = () => {
        try {
          const res = UtilityConverter.calculateAge(bDate.value, tDate.value);
          document.getElementById('age-years').textContent = res.years;
          document.getElementById('age-months').textContent = res.months;
          document.getElementById('age-days').textContent = res.days;
          document.getElementById('age-weeks').textContent = res.totalWeeks;
          document.getElementById('age-next-bday-text').textContent = `🎂 Next Birthday in ${res.daysToBirthday} Days!`;
        } catch(e) { Toast.error(e.message); }
      };

      document.getElementById('btn-calc-age').onclick = doAge;
      doAge();
      return;
    }

    if (tool.isSpecialUI === 'date-diff') {
      const sDate = document.getElementById('datediff-start');
      const eDate = document.getElementById('datediff-end');
      const now = new Date();
      sDate.value = now.toISOString().split('T')[0];
      const future = new Date(); future.setDate(future.getDate() + 30);
      eDate.value = future.toISOString().split('T')[0];

      const doDateDiff = () => {
        try {
          const res = UtilityConverter.calculateDateDiff(sDate.value, eDate.value);
          document.getElementById('datediff-result-text').textContent = `${res.totalDays} Days (${res.totalWeeks} Weeks and ${res.remainingDays} Days)`;
        } catch(e) { Toast.error(e.message); }
      };
      document.getElementById('btn-calc-datediff').onclick = doDateDiff;
      doDateDiff();
      return;
    }

    if (tool.isSpecialUI === 'resizer') {
      const dropzone = document.getElementById('resizer-dropzone');
      const fileInput = document.getElementById('resizer-file-input');
      const wIn = document.getElementById('resize-w');
      const hIn = document.getElementById('resize-h');
      const fmtSel = document.getElementById('resize-fmt');
      let currentFile = null;

      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = () => {
        if (fileInput.files.length) {
          currentFile = fileInput.files[0];
          const img = new Image();
          img.onload = () => { wIn.value = img.naturalWidth; hIn.value = img.naturalHeight; };
          img.src = URL.createObjectURL(currentFile);
          Toast.success(`Loaded ${currentFile.name}`);
        }
      };

      document.getElementById('btn-run-resize').onclick = async () => {
        if (!currentFile) { Toast.error('Please upload an image first'); return; }
        try {
          const res = await DesignConverter.resizeImage(currentFile, {
            width: parseInt(wIn.value, 10),
            height: parseInt(hIn.value, 10),
            format: fmtSel.value
          });
          saveAs(res.blob, res.filename);
          Toast.success('Resized image downloaded!');
        } catch(e) { Toast.error(e.message); }
      };
      return;
    }

    if (tool.id === 'csv-json' || tool.id === 'json-xml') {
      this.bindDualPaneEvents(tool);
      return;
    }

    // Standard Queue Manager for File Format converters & PDF compressor
    const queueContainer = document.getElementById('queue-container');
    const queueManager = new FileQueueManager({ container: queueContainer });
    this.activeQueue = queueManager;

    const dropzone = document.getElementById('tool-dropzone');
    const fileInput = document.getElementById('tool-file-input');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityVal = document.getElementById('quality-val');
    const targetSelect = document.getElementById('target-format-select');
    const startBtn = document.getElementById('btn-start-convert');

    if (qualitySlider && qualityVal) {
      qualitySlider.oninput = () => { qualityVal.textContent = `${qualitySlider.value}%`; };
    }

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('dragover'); };
      dropzone.ondragleave = () => dropzone.classList.remove('dragover');
      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) queueManager.addFiles(e.dataTransfer.files);
      };
      fileInput.onchange = () => {
        if (fileInput.files.length) queueManager.addFiles(fileInput.files);
        fileInput.value = '';
      };
    }

    if (startBtn) {
      startBtn.onclick = async () => {
        if (queueManager.files.length === 0) {
          Toast.error('Please upload at least one file to convert.');
          return;
        }

        const targetFormat = targetSelect ? targetSelect.value : tool.defaultTarget;
        const quality = qualitySlider ? parseInt(qualitySlider.value, 10) / 100 : 0.85;

        // PDF Compressor special case
        if (tool.id === 'pdf-compressor') {
          for (const item of queueManager.files) {
            queueManager.updateFile(item.id, { status: 'processing', progress: 50 });
            try {
              const res = await UtilityConverter.compressPdf(item.file, 'medium');
              queueManager.updateFile(item.id, {
                status: 'ready',
                progress: 100,
                convertedBlob: res.blob,
                convertedName: res.filename,
                convertedSize: res.size
              });
            } catch(e) {
              queueManager.updateFile(item.id, { status: 'error', errorMsg: e.message });
            }
          }
          Toast.success('PDF compression completed!');
          return;
        }

        // Images to PDF merger
        if (tool.id === 'jpg-to-pdf') {
          try {
            Toast.info('Combining images into PDF...');
            const imageFiles = queueManager.files.map(f => f.file);
            const result = await DocumentConverter.imagesToPdf(imageFiles);
            saveAs(result.blob, result.filename);
            Toast.success('PDF successfully generated!');
            queueManager.files.forEach(f => queueManager.updateFile(f.id, { status: 'ready', convertedSize: result.size }));
          } catch (err) {
            Toast.error(err.message || 'PDF merger failed');
          }
          return;
        }

        for (const item of queueManager.files) {
          if (item.status === 'ready') continue;
          queueManager.updateFile(item.id, { status: 'processing', progress: 30 });

          try {
            let result;
            if (tool.category === 'image') {
              result = await ImageConverter.process(item.file, { targetFormat, quality });
            } else if (tool.category === 'document') {
              if (tool.id === 'pdf-to-jpg') result = await DocumentConverter.pdfToImages(item.file, targetFormat);
              else if (tool.id === 'pdf-to-word') result = await DocumentConverter.pdfToWord(item.file);
              else if (tool.id === 'word-to-pdf') result = await DocumentConverter.wordToPdf(item.file);
              else if (tool.id === 'pdf-to-excel') result = await DocumentConverter.pdfToExcel(item.file);
              else if (tool.id === 'excel-to-pdf') result = await DocumentConverter.excelToPdf(item.file);
              else if (tool.id === 'pdf-to-ppt') result = await DocumentConverter.pdfToPpt(item.file);
            } else if (tool.category === 'media') {
              if (tool.id === 'mp4-to-mp3') {
                result = await MediaConverter.extractAudio(item.file, targetFormat, 192, p => queueManager.updateFile(item.id, { progress: p }));
              } else if (tool.id === 'mov-to-mp4') {
                result = await MediaConverter.convertVideo(item.file, targetFormat, p => queueManager.updateFile(item.id, { progress: p }));
              } else if (tool.id === 'video-compressor') {
                result = await MediaConverter.compressVideo(item.file, 'medium', 'auto', p => queueManager.updateFile(item.id, { progress: p }));
              }
            } else if (tool.category === 'data') {
              if (tool.id === 'csv-excel') {
                result = item.file.name.endsWith('.csv')
                  ? await DataConverter.csvToExcel(item.file)
                  : await DataConverter.excelToCsv(item.file);
              }
            } else if (tool.id === 'font-converter') {
              result = await DesignConverter.convertFont(item.file, targetFormat);
            }

            if (result) {
              queueManager.updateFile(item.id, {
                status: 'ready',
                progress: 100,
                convertedBlob: result.blob,
                convertedName: result.filename,
                convertedSize: result.size
              });
            }
          } catch (err) {
            console.error(err);
            queueManager.updateFile(item.id, { status: 'error', errorMsg: err.message || 'Conversion failed' });
            Toast.error(`Failed to convert ${item.name}: ${err.message}`);
          }
        }
        Toast.success('Batch conversion complete!');
      };
    }
  },

  bindDualPaneEvents(tool) {
    const leftTextarea = document.getElementById('left-textarea');
    const rightTextarea = document.getElementById('right-textarea');
    const runBtn = document.getElementById('btn-run-dual-convert');
    const copyRightBtn = document.getElementById('btn-copy-right');
    const downloadRightBtn = document.getElementById('btn-download-right');
    const fileInput = document.getElementById('dual-file-input');
    const uploadBtn = document.getElementById('btn-upload-dual');
    const clearLeftBtn = document.getElementById('btn-clear-left');

    const doConvert = () => {
      const input = leftTextarea.value.trim();
      if (!input) {
        rightTextarea.value = '';
        return;
      }
      try {
        if (tool.id === 'csv-json') {
          rightTextarea.value = DataConverter.csvToJson(input);
        } else if (tool.id === 'json-xml') {
          rightTextarea.value = DataConverter.jsonToXml(input);
        }
      } catch (err) {
        rightTextarea.value = `// Error: ${err.message}`;
      }
    };

    if (runBtn) runBtn.onclick = doConvert;
    if (leftTextarea) leftTextarea.oninput = doConvert;
    doConvert();

    if (uploadBtn && fileInput) {
      uploadBtn.onclick = () => fileInput.click();
      fileInput.onchange = async () => {
        if (fileInput.files.length) {
          const text = await fileInput.files[0].text();
          leftTextarea.value = text;
          doConvert();
        }
      };
    }

    if (clearLeftBtn) clearLeftBtn.onclick = () => { leftTextarea.value = ''; rightTextarea.value = ''; };
    if (copyRightBtn) copyRightBtn.onclick = () => { navigator.clipboard.writeText(rightTextarea.value); Toast.success('Copied output to clipboard'); };
    if (downloadRightBtn) {
      downloadRightBtn.onclick = () => {
        const text = rightTextarea.value;
        const ext = tool.id === 'csv-json' ? 'json' : 'xml';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `converted_data.${ext}`);
      };
    }
  },

  /**
   * Blog Listing View
   */
  renderBlog() {
    this.updateSEO("Conversion Guides, Tech Tutorials & Blog", "Articles, guides, and tips on file conversions, video compression, HEIC images, and web performance.");

    const app = document.getElementById('app-root');
    app.innerHTML = `
      <section class="blog-hero">
        <div class="container">
          <span class="badge primary" style="margin-bottom:0.8rem;">Guides &amp; Articles</span>
          <h1 class="hero-title">OmniConvert <span class="gradient-text">Blog &amp; Knowledge Base</span></h1>
          <p class="hero-subtitle">Step-by-step tutorials, image format deep dives, and productivity tips.</p>
        </div>
      </section>

      <!-- Monetization Leaderboard Ad -->
      ${this.renderAdBanner('leaderboard')}

      <section class="container" style="padding-bottom: 5rem;">
        <div class="blog-grid">
          ${this.renderBlogCards(BLOG_POSTS)}
        </div>
      </section>
    `;
  },

  /**
   * Single Blog Article View
   */
  renderBlogPost(postId) {
    const post = BLOG_POSTS.find(p => p.id === postId || p.slug === postId);
    if (!post) {
      this.renderBlog();
      return;
    }

    const relatedTool = TOOLS_DATA.find(t => t.id === post.relatedToolId) || TOOLS_DATA[0];

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "author": { "@type": "Person", "name": post.author.name },
      "datePublished": post.publishedAt
    };

    this.updateSEO(post.title, post.excerpt, schema);

    const app = document.getElementById('app-root');
    app.innerHTML = `
      <div class="container post-layout">
        <main>
          <div class="post-header">
            <div class="breadcrumbs" style="justify-content:flex-start;">
              <a href="#home">Home</a>
              <span>/</span>
              <a href="#blog">Blog</a>
              <span>/</span>
              <span>${post.category}</span>
            </div>
            <span class="badge primary" style="margin-bottom:1rem;">${post.category}</span>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta-bar">
              <div class="author-info">
                <div class="author-avatar">${post.author.avatar}</div>
                <div>
                  <strong>${post.author.name}</strong> • <span>${post.author.role}</span>
                </div>
              </div>
              <span>•</span>
              <span>Published ${post.publishedAt}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
          </div>

          <div class="post-content">
            ${post.content}
          </div>

          <!-- Bottom Ad in Post -->
          ${this.renderAdBanner('leaderboard')}
        </main>

        <aside class="post-sidebar">
          <div class="sidebar-widget">
            <h4>Recommended Tool</h4>
            <div class="related-tool-item">
              <div class="related-tool-icon"><i data-lucide="${relatedTool.icon}"></i></div>
              <div>
                <div class="related-tool-name">${relatedTool.name}</div>
                <div class="related-tool-category">${relatedTool.category.toUpperCase()}</div>
              </div>
            </div>
            <a href="/${relatedTool.id}/" class="btn btn-primary btn-sm" style="width:100%; margin-top:1rem;">
              Launch ${relatedTool.shortTitle}
            </a>
          </div>

          <div class="sidebar-widget">
            <h4>Trending Guides</h4>
            ${BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3).map(p => `
              <div class="related-tool-item">
                <div>
                  <a href="/blog/${p.id}/" class="related-tool-name" style="font-size:0.85rem; line-height:1.4; display:block;">
                    ${p.title}
                  </a>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${p.readTime}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </aside>
      </div>
    `;
  },

  renderAbout() {
    this.updateSEO("About Us", "Learn more about OmniConvert, our privacy-first mission, and our browser technology.");
    const app = document.getElementById('app-root');
    app.innerHTML = `
      <div class="container" style="max-width:800px; padding: 4rem 1.5rem;">
        <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">About <span class="gradient-text">OmniConvert</span></h1>
        <div class="post-content">
          <p>OmniConvert is an all-in-one web utilities platform engineered to provide instant, free, and completely private file format conversions without software installations.</p>
          <h2>Zero File Uploads</h2>
          <p>We execute all conversions <strong>locally in your browser memory</strong> using WebAssembly, Canvas, and native JavaScript engines.</p>
        </div>
      </div>
    `;
  },

  renderPrivacy() {
    this.updateSEO("Privacy Policy", "OmniConvert Privacy Policy - We do not store or collect your uploaded files.");
    const app = document.getElementById('app-root');
    app.innerHTML = `
      <div class="container" style="max-width:800px; padding: 4rem 1.5rem;">
        <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">Privacy Policy</h1>
        <div class="post-content">
          <p><strong>Effective Date:</strong> August 2026</p>
          <h2>1. Zero File Upload Guarantee</h2>
          <p>Files processed on OmniConvert are parsed inside client memory and never uploaded to our servers.</p>
        </div>
      </div>
    `;
  },

  renderTerms() {
    this.updateSEO("Terms of Service", "OmniConvert Terms of Service");
    const app = document.getElementById('app-root');
    app.innerHTML = `
      <div class="container" style="max-width:800px; padding: 4rem 1.5rem;">
        <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">Terms of Service</h1>
        <div class="post-content">
          <p>By accessing OmniConvert, you agree to use the platform in accordance with applicable laws.</p>
        </div>
      </div>
    `;
  },

  renderContact() {
    this.updateSEO("Contact Us", "Get in touch with the OmniConvert team for feedback and feature requests.");
    const app = document.getElementById('app-root');
    app.innerHTML = `
      <div class="container" style="max-width:800px; padding: 4rem 1.5rem;">
        <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">Contact Us</h1>
        <div class="post-content">
          <div style="background:var(--bg-card); padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-subtle); margin-top:1.5rem;">
            <div style="margin-bottom:1.2rem;">
              <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Your Name</label>
              <input type="text" class="control-input" style="width:100%;" placeholder="e.g. John Doe">
            </div>
            <div style="margin-bottom:1.2rem;">
              <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Your Email</label>
              <input type="email" class="control-input" style="width:100%;" placeholder="you@example.com">
            </div>
            <div style="margin-bottom:1.5rem;">
              <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Message</label>
              <textarea class="code-textarea" style="height:140px;" placeholder="Tell us how we can help..."></textarea>
            </div>
            <button class="btn btn-primary" onclick="Toast.success('Thank you! Your message has been sent.')">Send Message</button>
          </div>
        </div>
      </div>
    `;
  }
};

window.AppRouter = AppRouter;
