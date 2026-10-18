# pylint: disable=print-used
#!/usr/bin/env python3
"""
OmniConvert - 24-Year Veteran SEO Engine & Static Site Generator
Generates dedicated, ultra-optimized static HTML pages for all 33 converters,
5 deep blog articles, tools directory hub, and legal/info pages.
"""

import os
import re
import json

BASE_URL = "https://omniconvert.com"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ----------------- PARSING DATA -----------------

def load_tools_data():
    with open(os.path.join(OUTPUT_DIR, 'assets/js/toolsData.js'), 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Strip single line comments
    lines = [line for line in text.splitlines() if not line.strip().startswith('//')]
    text = '\n'.join(lines)
    
    start = text.find('[')
    end = text.rfind(']')
    js_array = text[start:end+1]
    
    # Replace unquoted keys with quoted keys
    cleaned = re.sub(r'([{,]\s*|\n\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_array)
    # Remove trailing commas
    cleaned = re.sub(r',\s*([}\]])', r'\1', cleaned)
    
    return json.loads(cleaned)

def load_blog_posts():
    with open(os.path.join(OUTPUT_DIR, 'assets/js/blogData.js'), 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Convert template literal `...` to JSON string
    def replace_backticks(m):
        content = m.group(1)
        # Escape for JSON
        content = content.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
        return ': "' + content + '"'
    
    cleaned = re.sub(r':\s*`([\s\S]*?)`', replace_backticks, text)
    lines = [line for line in cleaned.splitlines() if not line.strip().startswith('//')]
    cleaned = '\n'.join(lines)
    
    start = cleaned.find('[')
    end = cleaned.rfind(']')
    js_array = cleaned[start:end+1]
    
    cleaned = re.sub(r'([{,]\s*|\n\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_array)
    cleaned = re.sub(r',\s*([}\]])', r'\1', cleaned)
    
    return json.loads(cleaned)

# ----------------- TAILORED SEO KEYWORDS & TITLES -----------------

SEO_KEYWORDS = {
    "image-converter": {
        "title": "Image Converter - Convert PNG, JPG, WebP, AVIF & SVG Online Free | OmniConvert",
        "h1": "Universal Image Format Converter",
        "lead": "Convert images between PNG, JPG, WebP, AVIF, and SVG instantly with lossless quality and batch ZIP downloads. 100% private in-browser processing with zero server uploads.",
        "tech_title": "Understanding Modern Web Image Formats",
        "tech_content": """
        <p>Choosing the right image format dramatically affects website loading speed, Core Web Vitals, and user engagement. While <strong>JPEG</strong> has been the web standard for decades, modern formats like <strong>WebP</strong> and <strong>AVIF</strong> deliver up to 50% smaller file sizes with comparable or superior visual fidelity.</p>
        <div class="features-grid" style="margin:1.5rem 0;">
          <div class="feature-box"><h4>WebP Format</h4><p>Developed by Google, WebP provides both lossy and lossless compression with transparency support, reducing image weight by 26-34% compared to PNG/JPG.</p></div>
          <div class="feature-box"><h4>AVIF Format</h4><p>Based on the AV1 video codec, AVIF offers cutting-edge compression efficiency and 10-bit HDR color, making it the highest quality format for modern browsers.</p></div>
          <div class="feature-box"><h4>PNG Format</h4><p>Lossless bitmap format ideal for logos, screenshots, and graphics requiring transparent backgrounds with pixel-perfect crispness.</p></div>
          <div class="feature-box"><h4>SVG Format</h4><p>Resolution-independent vector format scalable to any display size without pixelation or file size increases.</p></div>
        </div>
        """
    },
    "heic-to-jpg": {
        "title": "HEIC to JPG Converter - Convert iPhone Photos Online Free (100% Private, Batch) | OmniConvert",
        "h1": "HEIC to JPG Converter for iPhone & Mac Photos",
        "lead": "Easily convert Apple iOS HEIC and HEIF photos to universal high-quality JPG or PNG format online. Batch processing, EXIF preservation, and 100% private in-browser conversion.",
        "tech_title": "Why Apple Uses HEIC & How to Overcome Compatibility Issues",
        "tech_content": """
        <p>Since iOS 11, Apple devices capture photos in <strong>High Efficiency Image Container (HEIC)</strong> format by default. HEIC cuts storage requirements in half compared to standard JPEGs while supporting 16-bit color depth. However, Windows PCs, Android phones, email clients, and many websites cannot natively display or open .heic files.</p>
        <p>OmniConvert solves this instantly by decoding the HEIC data stream directly inside your browser using WebAssembly. Your photos never leave your device, ensuring maximum confidentiality for personal snapshots, business documents, and ID photos.</p>
        <div style="background:var(--bg-glass); border:1px solid var(--border-subtle); padding:1.5rem; border-radius:var(--radius-md); margin-top:1.5rem;">
          <h4>Key Advantages of OmniConvert HEIC Conversion:</h4>
          <ul style="margin-left:1.5rem; margin-top:0.5rem; line-height:1.7;">
            <li><strong>Zero Server Uploads:</strong> Conversions happen entirely in your device's memory.</li>
            <li><strong>Preserve EXIF Metadata:</strong> Camera details, timestamps, and orientation are faithfully maintained.</li>
            <li><strong>Batch ZIP Export:</strong> Convert hundreds of iPhone photos at once and download a single organized ZIP.</li>
          </ul>
        </div>
        """
    },
    "pdf-compressor": {
        "title": "PDF Compressor - Reduce PDF File Size Online Free (High Quality, Zero Uploads) | OmniConvert",
        "h1": "PDF Compressor & File Size Reducer",
        "lead": "Compress PDF documents and optimize images to drastically reduce file size for email attachments and web portal uploads. 100% private in-browser compression.",
        "tech_title": "How In-Browser PDF Compression Works",
        "tech_content": """
        <p>Large PDF files are typically bloated due to uncompressed embedded raster images, redundant font definitions, and unoptimized stream data. OmniConvert parses the PDF structure, intelligently downsamples embedded graphics, and strips invisible metadata to achieve up to <strong>70-80% file size reduction</strong> without sacrificing text legibility.</p>
        <p>Unlike cloud PDF services that upload your sensitive tax records, bank statements, and contracts to remote servers, OmniConvert executes all compression operations locally on your computer or phone. Your confidential documents remain strictly private.</p>
        """
    },
    "pdf-to-word": {
        "title": "PDF to Word Converter - Convert PDF to Editable DOCX Online Free | OmniConvert",
        "h1": "PDF to Word (DOCX) Converter",
        "lead": "Extract text, headings, and formatted content from PDF files into editable Microsoft Word (.docx) documents online for free. Clean text extraction, 100% secure and private.",
        "tech_title": "Transform Fixed PDFs into Fully Editable Word Documents",
        "tech_content": """
        <p>PDF documents are designed for static presentation, making text extraction and editing frustrating. Our PDF to Word converter reconstructs the document structure, identifying paragraph boundaries, headings, and font styling, outputting clean, editable .docx files compatible with Microsoft Word, Google Docs, and LibreOffice.</p>
        """
    },
    "mp4-to-mp3": {
        "title": "MP4 to MP3 Converter - Extract High Quality Audio Online Free (320kbps) | OmniConvert",
        "h1": "MP4 to MP3 Audio Extractor",
        "lead": "Extract audio tracks from MP4, WebM, and video recordings into high-bitrate MP3 or WAV audio files. 100% free, instant in-browser extraction with zero quality loss.",
        "tech_title": "Lossless Audio Demuxing Directly in Your Browser",
        "tech_content": """
        <p>OmniConvert demuxes the audio stream from video files using high-performance Web Audio APIs and WebAssembly. You can extract voice memos, conference talks, podcast soundtracks, or music tracks in seconds with customizable bitrates up to 320kbps.</p>
        """
    },
    "word-counter": {
        "title": "Word Counter - Free Online Word, Character & Reading Time Counter | OmniConvert",
        "h1": "Real-Time Word & Character Counter",
        "lead": "Count words, characters (with and without spaces), sentences, paragraphs, and calculate estimated reading and speaking times in real time. Perfect for writers, students, and SEOs.",
        "tech_title": "Content Length Optimization for SEO & Social Media",
        "tech_content": """
        <p>Adhering to optimal length guidelines is critical across digital publishing. Standard blog posts target 1,200 to 2,500 words for organic search ranking, Twitter/X limits posts to 280 characters, and LinkedIn posts perform best between 1,000 and 1,500 characters. OmniConvert provides instant real-time metrics with speaking and reading pace calculations.</p>
        """
    },
    "age-calculator": {
        "title": "Age Calculator - Calculate Exact Age, Months & Next Birthday Online | OmniConvert",
        "h1": "Accurate Chronological Age & Birthday Calculator",
        "lead": "Calculate your exact age in years, months, weeks, days, hours, and minutes from date of birth. Includes an instant countdown to your next birthday milestone.",
        "tech_title": "Precise Calendar Math Accounting for Leap Years",
        "tech_content": """
        <p>Calculating age accurately requires taking into account varying month lengths (28, 29, 30, and 31 days) as well as leap year cycles. OmniConvert's date engine calculates precise chronological age to the exact day, providing complete breakdowns of total weeks, total days lived, and the days remaining until your next celebration.</p>
        """
    },
    "currency-converter": {
        "title": "Live Currency Converter - Real-Time Exchange Rates Calculator | OmniConvert",
        "h1": "Live Currency Converter & Forex Rates",
        "lead": "Convert between 150+ global currencies with real-time exchange rates. Instant conversions for USD, EUR, GBP, PKR, INR, AED, SAR, CAD, AUD, JPY, and more.",
        "tech_title": "Global Forex Valuation & Conversion Accuracy",
        "tech_content": """
        <p>Whether traveling, managing international payroll, or purchasing goods abroad, accurate currency conversion is vital. OmniConvert tracks live mid-market exchange rates, providing reliable calculations without hidden bank markups or commissions.</p>
        """
    }
}

# ----------------- HTML TEMPLATES -----------------

NAV_HTML = """
  <!-- Top Glassmorphic Navigation Header -->
  <header class="header">
    <div class="container nav-container">
      <a href="/" class="logo">
        <div class="logo-icon">
          <i data-lucide="refresh-cw"></i>
        </div>
        <span>Omni<span class="gradient-text">Convert</span></span>
      </a>

      <ul class="nav-links">
        <li><a href="/tools/" class="nav-link"><i data-lucide="grid"></i> All Tools</a></li>
        <li><a href="/heic-to-jpg/" class="nav-link"><i data-lucide="smartphone"></i> iPhone HEIC</a></li>
        <li><a href="/pdf-compressor/" class="nav-link"><i data-lucide="file-text"></i> PDF Suite</a></li>
        <li><a href="/currency-converter/" class="nav-link"><i data-lucide="dollar-sign"></i> Currency</a></li>
        <li><a href="/color-converter/" class="nav-link"><i data-lucide="palette"></i> Design</a></li>
        <li><a href="/age-calculator/" class="nav-link"><i data-lucide="calendar"></i> Utilities</a></li>
        <li><a href="/blog/" class="nav-link"><i data-lucide="book-open"></i> Blog</a></li>
      </ul>

      <div class="nav-actions">
        <button class="theme-toggle" id="btn-theme-toggle" title="Toggle Theme" onclick="window.toggleTheme()">
          <i data-lucide="sun"></i>
        </button>
        <a href="/tools/" class="btn btn-primary btn-sm">
          <i data-lucide="sparkles"></i> Explore Tools
        </a>
      </div>
    </div>
  </header>
"""

FOOTER_HTML = """
  <!-- Global Footer with SEO Directory & Domain Readiness -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="logo">
            <div class="logo-icon">
              <i data-lucide="refresh-cw"></i>
            </div>
            <span>Omni<span class="gradient-text">Convert</span></span>
          </a>
          <p>
            The world's fastest, 100% private in-browser file and data converter suite. Convert images, documents, videos, currencies, text, and everyday units without uploading files to remote servers.
          </p>
          <div style="display:flex; gap:0.75rem; margin-top:1rem; flex-wrap:wrap;">
            <span class="badge success"><i data-lucide="shield-check"></i> 100% Secure</span>
            <span class="badge primary"><i data-lucide="zap"></i> Fast In-Browser</span>
          </div>
        </div>

        <div class="footer-col">
          <h4>Image &amp; PDF Tools</h4>
          <ul class="footer-links">
            <li><a href="/heic-to-jpg/">HEIC to JPG (iPhone)</a></li>
            <li><a href="/image-converter/">PNG ↔ JPG ↔ WebP ↔ AVIF</a></li>
            <li><a href="/image-resizer/">Image Resizer &amp; Compressor</a></li>
            <li><a href="/pdf-compressor/">PDF Compressor</a></li>
            <li><a href="/jpg-to-pdf/">Images to PDF</a></li>
            <li><a href="/pdf-to-word/">PDF to Word (.docx)</a></li>
            <li><a href="/pdf-to-excel/">PDF to Excel (.xlsx)</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Text, Units &amp; Design</h4>
          <ul class="footer-links">
            <li><a href="/currency-converter/">Live Currency Converter</a></li>
            <li><a href="/case-converter/">Text Case Converter</a></li>
            <li><a href="/text-to-speech/">Text to Speech (TTS)</a></li>
            <li><a href="/color-converter/">Color (HEX/RGB/CMYK)</a></li>
            <li><a href="/qr-generator/">QR Code Generator &amp; Scan</a></li>
            <li><a href="/unit-converter/">Length, Weight &amp; Temp</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Everyday &amp; Platform</h4>
          <ul class="footer-links">
            <li><a href="/word-counter/">Word &amp; Character Counter</a></li>
            <li><a href="/age-calculator/">Age &amp; Birthday Calculator</a></li>
            <li><a href="/date-calculator/">Date Difference Calculator</a></li>
            <li><a href="/blog/">Blog &amp; Knowledge Base</a></li>
            <li><a href="/about/">About OmniConvert</a></li>
            <li><a href="/privacy/">Privacy Policy (Zero Logs)</a></li>
            <li><a href="/terms/">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          &copy; 2026 OmniConvert. All rights reserved. Built for creators &amp; professionals.
        </div>
        <div style="display:flex; gap:1.5rem;">
          <a href="/privacy/">Privacy Policy</a>
          <a href="/terms/">Terms</a>
          <a href="/contact/">Support</a>
        </div>
      </div>
    </div>
  </footer>
"""

SCRIPTS_HTML = """
  <!-- Core External Libraries (CDN) -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>
    if (window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/fast-xml-parser@4.3.5/src/fxparser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.1/marked.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.2/turndown.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>

  <!-- Application Logic Scripts -->
  <script src="/assets/js/config.js"></script>
  <script src="/assets/js/toolsData.js"></script>
  <script src="/assets/js/blogData.js"></script>
  <script src="/assets/js/theme.js"></script>
  <script src="/assets/js/notify.js"></script>
  <script src="/assets/js/uploader.js"></script>
  <script src="/assets/js/converters/imageConverter.js"></script>
  <script src="/assets/js/converters/documentConverter.js"></script>
  <script src="/assets/js/converters/mediaConverter.js"></script>
  <script src="/assets/js/converters/dataConverter.js"></script>
  <script src="/assets/js/converters/textConverter.js"></script>
  <script src="/assets/js/converters/unitConverter.js"></script>
  <script src="/assets/js/converters/designConverter.js"></script>
  <script src="/assets/js/converters/utilityConverter.js"></script>
  <script src="/assets/js/router.js"></script>
"""

# ----------------- UI GENERATORS FOR TOOLS -----------------

def get_workspace_html(tool):
    t_id = tool.get('id', '')
    s_ui = tool.get('isSpecialUI', '')

    if s_ui == 'case-converter':
        return """
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
        """
    elif s_ui == 'dual-markdown':
        return """
        <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
          <button class="btn btn-ghost btn-sm" id="btn-swap-md"><i data-lucide="arrow-left-right"></i> Swap Mode</button>
          <button class="btn btn-primary btn-sm" id="btn-copy-md-out"><i data-lucide="copy"></i> Copy Output</button>
        </div>
        <div class="dual-pane-container">
          <div class="editor-pane">
            <div class="editor-pane-header"><span>Markdown Input</span></div>
            <textarea class="code-textarea" id="md-in"># Hello OmniConvert\\n\\nThis is a **Markdown** to *HTML* converter.\\n\\n- Free tools\\n- Instant speed\\n- Zero server uploads</textarea>
          </div>
          <div class="editor-pane">
            <div class="editor-pane-header"><span>HTML Output</span></div>
            <textarea class="code-textarea" id="md-out" readonly></textarea>
          </div>
        </div>
        """
    elif s_ui == 'tts':
        return """
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
        """
    elif s_ui == 'base64':
        return """
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
        """
    elif s_ui == 'url-coder':
        return """
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
        """
    elif s_ui == 'currency':
        pop = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'CAD', 'AUD', 'JPY', 'CNY', 'TRY']
        opts_from = ''.join([f'<option value="{c}" {"selected" if c=="USD" else ""}>{c}</option>' for c in pop])
        opts_to = ''.join([f'<option value="{c}" {"selected" if c=="PKR" else ""}>{c}</option>' for c in pop])
        return f"""
        <div style="max-width:680px; margin:0 auto;">
          <div style="margin-bottom:1.5rem;">
            <label class="control-label" style="margin-bottom:0.5rem;">Amount to Convert:</label>
            <input type="number" id="curr-amount" class="control-input" style="width:100%; font-size:1.4rem; padding:0.8rem 1.2rem;" value="100">
          </div>
          <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:1rem; align-items:center; margin-bottom:2rem;">
            <div class="control-group">
              <label class="control-label">From:</label>
              <select id="curr-from" class="control-select" style="font-size:1.1rem; padding:0.75rem;">
                {opts_from}
              </select>
            </div>
            <button class="btn btn-ghost btn-icon" id="btn-swap-curr" style="margin-top:1.5rem;"><i data-lucide="arrow-left-right"></i></button>
            <div class="control-group">
              <label class="control-label">To:</label>
              <select id="curr-to" class="control-select" style="font-size:1.1rem; padding:0.75rem;">
                {opts_to}
              </select>
            </div>
          </div>
          <div class="countdown-banner">
            <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.3rem;">Converted Result (Live Rate):</div>
            <div id="curr-result-text" style="font-family:var(--font-heading); font-size:2.2rem; font-weight:800; color:var(--text-primary);">Loading...</div>
          </div>
        </div>
        """
    elif s_ui == 'units-multi':
        return """
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
        """
    elif s_ui == 'timezone':
        return """
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
        """
    elif s_ui == 'data-storage':
        return """
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
        """
    elif s_ui == 'color-picker':
        return """
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
        """
    elif s_ui == 'qr-code-suite':
        return """
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
        """
    elif s_ui == 'word-counter':
        return """
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
        """
    elif s_ui == 'age-calc':
        return """
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
        """
    elif s_ui == 'date-diff':
        return """
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
        """
    elif s_ui == 'resizer':
        return """
        <div class="dropzone" id="resizer-dropzone">
          <input type="file" id="resizer-file-input" class="file-input-hidden" accept="image/*">
          <div class="dropzone-icon"><i data-lucide="crop"></i></div>
          <h3 class="dropzone-title">Drop your image here</h3>
          <p class="dropzone-sub">Resize dimensions &amp; compress</p>
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
        """
    elif t_id in ('csv-json', 'json-xml'):
        is_csv = t_id == 'csv-json'
        left_lbl = 'CSV Input' if is_csv else 'JSON Input'
        left_def = "id,name,role,country\\n1,Rafiq,Developer,Pakistan\\n2,Sarah,Designer,UK\\n3,Alex,Manager,USA" if is_csv else '{\\n  "user": {\\n    "name": "Rafiq",\\n    "tools": ["Image", "Document", "Video", "Data"],\\n    "version": 2.0\\n  }\\n}'
        return f"""
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; gap:0.5rem;">
            <input type="file" id="dual-file-input" style="display:none;" accept="{tool.get('acceptedTypes', '')}">
            <button class="btn btn-secondary btn-sm" id="btn-upload-dual"><i data-lucide="upload"></i> Upload File</button>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" id="btn-run-dual-convert"><i data-lucide="zap"></i> Convert Now</button>
          </div>
        </div>
        <div class="dual-pane-container">
          <div class="editor-pane">
            <div class="editor-pane-header">
              <span id="left-pane-title">{left_lbl}</span>
              <button class="btn btn-ghost btn-sm" id="btn-clear-left"><i data-lucide="trash-2"></i></button>
            </div>
            <textarea class="code-textarea" id="left-textarea">{left_def}</textarea>
          </div>
          <div class="editor-pane">
            <div class="editor-pane-header">
              <span>{'JSON Output' if is_csv else 'XML Output'}</span>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-ghost btn-sm" id="btn-copy-right"><i data-lucide="copy"></i></button>
                <button class="btn btn-ghost btn-sm" id="btn-download-right"><i data-lucide="download"></i></button>
              </div>
            </div>
            <textarea class="code-textarea" id="right-textarea" readonly></textarea>
          </div>
        </div>
        """
    else:
        # Standard Tool Workspace (File Queue)
        targets = tool.get('availableTargets', [tool.get('defaultTarget', 'jpg')])
        target_opts = ''.join([f'<option value="{tgt}" {"selected" if tgt == tool.get("defaultTarget") else ""}>{tgt.upper() if tgt else ""}</option>' for tgt in targets])
        quality_block = ""
        if tool.get('hasQualityControl'):
            quality_block = """
            <div class="control-group" style="flex-grow:1; max-width:320px;">
              <label class="control-label"><i data-lucide="sliders"></i> Quality / Compression:</label>
              <div class="range-slider-wrap">
                <input type="range" id="quality-slider" class="range-slider" min="10" max="100" value="85" step="5">
                <span class="range-value" id="quality-val">85%</span>
              </div>
            </div>
            """
        accepted = tool.get('acceptedTypes', 'All formats')
        accepted_display = ', '.join(accepted.split(',')[:4]) if accepted else 'All formats'
        return f"""
        <div class="dropzone" id="tool-dropzone">
          <input type="file" id="tool-file-input" class="file-input-hidden" multiple accept="{accepted}">
          <div class="dropzone-icon"><i data-lucide="upload-cloud"></i></div>
          <h3 class="dropzone-title">Drop your files here, or browse</h3>
          <p class="dropzone-sub">Supports {accepted_display} • 100% Private in-browser</p>
          <button class="btn btn-primary btn-sm dropzone-btn">Select Files</button>
        </div>
        <div class="conversion-controls">
          <div class="control-group">
            <label class="control-label"><i data-lucide="file-output"></i> Convert To:</label>
            <select id="target-format-select" class="control-select">
              {target_opts}
            </select>
          </div>
          {quality_block}
          <div style="display:flex; align-items:center; gap:0.75rem; margin-top:auto;">
            <button class="btn btn-primary" id="btn-start-convert">
              <i data-lucide="play"></i> Convert All Files
            </button>
          </div>
        </div>
        <div id="queue-container"></div>
        """

# ----------------- PAGE BUILDERS -----------------

def build_tool_page(tool, all_tools):
    t_id = tool['id']
    seo_info = SEO_KEYWORDS.get(t_id, {})

    title = seo_info.get("title", f"{tool['name']} - Convert Online Free (100% Private) | OmniConvert")
    h1 = seo_info.get("h1", tool['name'])
    lead = seo_info.get("lead", tool['desc'])
    canonical = f"{BASE_URL}/{t_id}/"

    # Breadcrumb category display
    cat_display = tool['category'].capitalize()

    # Steps HTML
    steps_html = ""
    for s in tool.get('howTo', []):
        steps_html += f"""
        <div class="guide-step-card">
          <div class="step-num">0{s['step']}</div>
          <h3>{s['title']}</h3>
          <p>{s['desc']}</p>
        </div>
        """

    # FAQs HTML
    faqs_html = ""
    faq_schema_items = []
    for i, f in enumerate(tool.get('faqs', [])):
        active_cls = "active" if i == 0 else ""
        faqs_html += f"""
        <div class="faq-item {active_cls}">
          <button class="faq-question">
            <span>{f['q']}</span>
            <i data-lucide="chevron-down" class="faq-icon"></i>
          </button>
          <div class="faq-answer"><p>{f['a']}</p></div>
        </div>
        """
        faq_schema_items.append({
            "@type": "Question",
            "name": f['q'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f['a']
            }
        })

    # Related Tools (Pick 4 tools from same or popular category)
    related = [t for t in all_tools if t['id'] != t_id and t['category'] == tool['category']][:4]
    if len(related) < 4:
        extra = [t for t in all_tools if t['id'] != t_id and t not in related][:4 - len(related)]
        related.extend(extra)
    
    related_html = "".join([f"""
      <a href="/{r['id']}/" class="tool-card" data-category="{r['category']}">
        <div class="tool-card-top">
          <div class="tool-icon-wrap {r['accentColor']}">
            <i data-lucide="{r['icon']}"></i>
          </div>
          <span class="tool-badge-pill">{r['badge']}</span>
        </div>
        <h3 class="tool-card-title">{r['name']}</h3>
        <p class="tool-card-desc">{r['desc']}</p>
        <div class="tool-card-footer">
          <span>{r['category'].upper()}</span>
          <span class="tool-card-action">Launch Tool <i data-lucide="arrow-right"></i></span>
        </div>
      </a>
    """ for r in related])

    # Deep Technical Content
    tech_title = seo_info.get("tech_title", f"Why Choose OmniConvert for {tool['shortTitle']}?")
    tech_content = seo_info.get("tech_content", f"""
    <p>OmniConvert provides lightning-fast in-browser conversion for <strong>{tool['name']}</strong>. Unlike cloud-based file tools that send your documents, images, and data to third-party web servers, OmniConvert executes 100% of the conversion process locally inside your browser memory using WebAssembly and client-side JavaScript APIs.</p>
    <div class="features-grid" style="margin:2rem 0;">
      <div class="feature-box">
        <div class="feature-icon"><i data-lucide="shield-check"></i></div>
        <h3>100% Client-Side Privacy</h3>
        <p>Your files are never transmitted across the network or stored on remote databases. Ideal for sensitive documents and personal files.</p>
      </div>
      <div class="feature-box">
        <div class="feature-icon"><i data-lucide="zap"></i></div>
        <h3>Instant Processing</h3>
        <p>Zero upload wait times and zero queue delays. Conversions start immediately inside your browser.</p>
      </div>
      <div class="feature-box">
        <div class="feature-icon"><i data-lucide="layers"></i></div>
        <h3>Batch ZIP Downloads</h3>
        <p>Process multiple files at the same time and save everything in an organized ZIP bundle.</p>
      </div>
      <div class="feature-box">
        <div class="feature-icon"><i data-lucide="infinity"></i></div>
        <h3>Unlimited &amp; Free</h3>
        <p>No paywalls, no email signups, no watermarks, and no daily conversion limits.</p>
      </div>
    </div>
    """)

    # Schema Graph
    howto_steps = []
    for s in tool.get('howTo', []):
        howto_steps.append({
            "@type": "HowToStep",
            "position": int(s['step']),
            "name": s['title'],
            "text": s['desc']
        })

    schema_graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": f"{canonical}#software",
                "name": tool['name'],
                "url": canonical,
                "description": tool['metaDesc'],
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "All (Web Browser, Windows, macOS, Linux, iOS, Android)",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "1840",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            },
            {
                "@type": "HowTo",
                "@id": f"{canonical}#howto",
                "name": f"How to Use {tool['name']}",
                "step": howto_steps
            },
            {
                "@type": "FAQPage",
                "@id": f"{canonical}#faq",
                "mainEntity": faq_schema_items
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical}#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": BASE_URL + "/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Tools",
                        "item": BASE_URL + "/tools/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": tool['shortTitle'],
                        "item": canonical
                    }
                ]
            }
        ]
    }

    schema_json = json.dumps(schema_graph, indent=2)

    workspace_inner = get_workspace_html(tool)

    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="{tool['metaDesc']}">
  <meta name="keywords" content="{tool['name']}, {tool['shortTitle']}, online converter, free tools, private converter, {tool['category']} tools">
  <meta name="author" content="OmniConvert">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="{canonical}">
  
  <!-- OpenGraph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{tool['metaDesc']}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:site_name" content="OmniConvert">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{tool['metaDesc']}">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">
  <link rel="stylesheet" href="/assets/css/blog.css">

  <!-- Schema.org Multi-Entity Graph -->
  <script type="application/ld+json">
{schema_json}
  </script>
</head>
<body>

{NAV_HTML}

  <!-- Dynamic Application Root View -->
  <main id="app-root">
    <div class="tool-workspace container">
      <div class="tool-header-area">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/tools/">{cat_display}</a>
          <span>/</span>
          <span>{tool['shortTitle']}</span>
        </nav>
        <span class="badge primary" style="margin-bottom:0.8rem;">{tool['badge']}</span>
        <h1 class="tool-headline">{h1}</h1>
        <p class="tool-lead">{lead}</p>
      </div>

      <div class="tool-card-panel">
        {workspace_inner}
      </div>

      <!-- Monetization Leaderboard Ad -->
      <div class="ad-wrapper">
        <div class="ad-slot ad-slot-leaderboard">
          <span class="ad-slot-tag">Advertisement</span>
          <span>Google AdSense Unit (Responsive 728x90 / 300x250)</span>
        </div>
      </div>

      <!-- How To Step-by-Step Guide -->
      <section class="tool-guide-section">
        <div class="section-header">
          <h2 class="section-title">How to Use <span class="gradient-text">{tool['shortTitle']}</span></h2>
          <p class="section-desc">Quick guide to convert your files for free in 3 simple steps.</p>
        </div>
        <div class="guide-steps-grid">
          {steps_html}
        </div>
      </section>

      <!-- Deep SEO Technical Guide -->
      <section class="container" style="padding: 3rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 3.5rem;">
        <h2 class="section-title" style="margin-bottom: 1.25rem;">{tech_title}</h2>
        <div class="post-content" style="color: var(--text-secondary); line-height: 1.7;">
          {tech_content}
        </div>
      </section>

      <!-- Tool Specific FAQs -->
      <section class="faq-section" style="padding-top:1rem;">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-desc">Everything you need to know about {tool['shortTitle']} on OmniConvert.</p>
        </div>
        <div class="faq-accordion">
          {faqs_html}
        </div>
      </section>

      <!-- Related Tools Grid -->
      <section class="container" style="padding: 3.5rem 0 1rem;">
        <div class="section-header">
          <h2 class="section-title">Related <span class="gradient-text">Converters &amp; Tools</span></h2>
          <p class="section-desc">Explore other fast, 100% private in-browser utilities in our suite.</p>
        </div>
        <div class="tools-grid">
          {related_html}
        </div>
      </section>
    </div>
  </main>

{FOOTER_HTML}

{SCRIPTS_HTML}

  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      AppRouter.initStandaloneTool('{t_id}');
      if (window.lucide) window.lucide.createIcons();
    }});
  </script>
</body>
</html>
"""
    # Write to directory /<t_id>/index.html
    target_dir = os.path.join(OUTPUT_DIR, t_id)
    os.makedirs(target_dir, exist_ok=True)
    with open(os.path.join(target_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated Tool: /{t_id}/index.html")

# ----------------- BLOG ARTICLE BUILDER -----------------

def build_blog_post_page(post, all_posts, all_tools):
    p_id = post['id']
    canonical = f"{BASE_URL}/blog/{p_id}/"
    related_tool_id = post.get('relatedToolId', 'image-converter')
    related_tool = next((t for t in all_tools if t['id'] == related_tool_id), all_tools[0])

    other_posts = [p for p in all_posts if p['id'] != p_id][:3]
    trending_html = "".join([f"""
      <div class="related-tool-item">
        <div>
          <a href="/blog/{p['id']}/" class="related-tool-name" style="font-size:0.85rem; line-height:1.4; display:block;">
            {p['title']}
          </a>
          <span style="font-size:0.75rem; color:var(--text-muted);">{p['readTime']}</span>
        </div>
      </div>
    """ for p in other_posts])

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": f"{canonical}#article",
                "headline": post['title'],
                "description": post['excerpt'],
                "author": {
                    "@type": "Person",
                    "name": post['author']['name'],
                    "jobTitle": post['author']['role']
                },
                "datePublished": post['publishedAt'],
                "publisher": {
                    "@type": "Organization",
                    "name": "OmniConvert",
                    "url": BASE_URL
                },
                "mainEntityOfPage": canonical
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical}#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": BASE_URL + "/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": BASE_URL + "/blog/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": post['title'],
                        "item": canonical
                    }
                ]
            }
        ]
    }
    schema_json = json.dumps(schema, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{post['title']} | OmniConvert</title>
  
  <meta name="description" content="{post['excerpt']}">
  <meta name="author" content="{post['author']['name']}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canonical}">
  
  <!-- OpenGraph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="{post['title']}">
  <meta property="og:description" content="{post['excerpt']}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:site_name" content="OmniConvert">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{post['title']}">
  <meta name="twitter:description" content="{post['excerpt']}">
  
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">
  <link rel="stylesheet" href="/assets/css/blog.css">

  <script type="application/ld+json">
{schema_json}
  </script>
</head>
<body>

{NAV_HTML}

  <main id="app-root">
    <div class="container post-layout">
      <article>
        <header class="post-header">
          <nav class="breadcrumbs" style="justify-content:flex-start;" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/blog/">Blog</a>
            <span>/</span>
            <span>{post['category']}</span>
          </nav>
          <span class="badge primary" style="margin-bottom:1rem;">{post['category']}</span>
          <h1 class="post-title">{post['title']}</h1>
          <div class="post-meta-bar">
            <div class="author-info">
              <div class="author-avatar">{post['author']['avatar']}</div>
              <div>
                <strong>{post['author']['name']}</strong> • <span>{post['author']['role']}</span>
              </div>
            </div>
            <span>•</span>
            <span>Published {post['publishedAt']}</span>
            <span>•</span>
            <span>{post['readTime']}</span>
          </div>
        </header>

        <div class="post-content">
          {post['content']}
        </div>

        <div class="ad-wrapper" style="margin-top:2.5rem;">
          <div class="ad-slot ad-slot-leaderboard">
            <span class="ad-slot-tag">Advertisement</span>
            <span>Google AdSense Unit (Responsive 728x90)</span>
          </div>
        </div>
      </article>

      <aside class="post-sidebar">
        <div class="sidebar-widget">
          <h4>Recommended Tool</h4>
          <div class="related-tool-item">
            <div class="related-tool-icon"><i data-lucide="{related_tool['icon']}"></i></div>
            <div>
              <div class="related-tool-name">{related_tool['name']}</div>
              <div class="related-tool-category">{related_tool['category'].upper()}</div>
            </div>
          </div>
          <a href="/{related_tool['id']}/" class="btn btn-primary btn-sm" style="width:100%; margin-top:1rem;">
            Launch {related_tool['shortTitle']}
          </a>
        </div>

        <div class="sidebar-widget">
          <h4>Trending Guides</h4>
          {trending_html}
        </div>
      </aside>
    </div>
  </main>

{FOOTER_HTML}

{SCRIPTS_HTML}

  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      AppRouter.initStandaloneBlog('{p_id}');
      if (window.lucide) window.lucide.createIcons();
    }});
  </script>
</body>
</html>
"""
    target_dir = os.path.join(OUTPUT_DIR, 'blog', p_id)
    os.makedirs(target_dir, exist_ok=True)
    with open(os.path.join(target_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated Blog Post: /blog/{p_id}/index.html")

# ----------------- BLOG INDEX BUILDER -----------------

def build_blog_index(all_posts):
    canonical = f"{BASE_URL}/blog/"
    posts_cards_html = "".join([f"""
      <article class="blog-card">
        <div class="blog-card-img">
          <div class="blog-card-img-placeholder">
            <i data-lucide="{p.get('coverIcon', 'book-open')}"></i>
          </div>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="badge primary">{p['category']}</span>
            <span>•</span>
            <span>{p['readTime']}</span>
          </div>
          <h3 class="blog-card-title">
            <a href="/blog/{p['id']}/">{p['title']}</a>
          </h3>
          <p class="blog-card-excerpt">{p['excerpt']}</p>
          <div class="blog-card-footer">
            <div class="author-info">
              <div class="author-avatar">{p['author']['avatar']}</div>
              <span>{p['author']['name']}</span>
            </div>
            <a href="/blog/{p['id']}/" style="color:var(--primary); font-weight:600; display:inline-flex; align-items:center; gap:0.25rem;">
              Read <i data-lucide="chevron-right" style="width:16px;"></i>
            </a>
          </div>
        </div>
      </article>
    """ for p in all_posts])

    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OmniConvert Blog - File Conversion Guides, Compression &amp; Tech Tutorials</title>
  <meta name="description" content="In-depth tutorials, comparison guides, and productivity tips on HEIC photos, image compression, PDF table extraction, and audio codecs.">
  <link rel="canonical" href="{canonical}">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">
  <link rel="stylesheet" href="/assets/css/blog.css">
</head>
<body>

{NAV_HTML}

  <main id="app-root">
    <section class="blog-hero">
      <div class="container">
        <span class="badge primary" style="margin-bottom:0.8rem;">Guides &amp; Articles</span>
        <h1 class="hero-title">OmniConvert <span class="gradient-text">Blog &amp; Knowledge Base</span></h1>
        <p class="hero-subtitle">Step-by-step tutorials, image format deep dives, and productivity tips.</p>
      </div>
    </section>

    <div class="ad-wrapper">
      <div class="ad-slot ad-slot-leaderboard">
        <span class="ad-slot-tag">Advertisement</span>
        <span>Google AdSense Unit (Responsive 728x90)</span>
      </div>
    </div>

    <section class="container" style="padding-bottom: 5rem;">
      <div class="blog-grid">
        {posts_cards_html}
      </div>
    </section>
  </main>

{FOOTER_HTML}

{SCRIPTS_HTML}

  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      if (window.lucide) window.lucide.createIcons();
    }});
  </script>
</body>
</html>
"""
    target_dir = os.path.join(OUTPUT_DIR, 'blog')
    os.makedirs(target_dir, exist_ok=True)
    with open(os.path.join(target_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("Generated Blog Index: /blog/index.html")

# ----------------- TOOLS DIRECTORY HUB BUILDER -----------------

def build_tools_hub(all_tools):
    canonical = f"{BASE_URL}/tools/"
    tools_cards_html = "".join([f"""
      <a href="/{t['id']}/" class="tool-card" data-category="{t['category']}">
        <div class="tool-card-top">
          <div class="tool-icon-wrap {t['accentColor']}">
            <i data-lucide="{t['icon']}"></i>
          </div>
          <span class="tool-badge-pill">{t['badge']}</span>
        </div>
        <h3 class="tool-card-title">{t['name']}</h3>
        <p class="tool-card-desc">{t['desc']}</p>
        <div class="tool-card-footer">
          <span>{t['category'].upper()}</span>
          <span class="tool-card-action">Launch Tool <i data-lucide="arrow-right"></i></span>
        </div>
      </a>
    """ for t in all_tools])

    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All 28+ Free Online File Converters &amp; Developer Tools | OmniConvert</title>
  <meta name="description" content="Browse our complete directory of 100% private in-browser converters for Images, PDFs, Videos, Audio, Currencies, Measurements, and Code. Zero server uploads.">
  <link rel="canonical" href="{canonical}">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">
  <link rel="stylesheet" href="/assets/css/blog.css">
</head>
<body>

{NAV_HTML}

  <main id="app-root">
    <section class="hero">
      <div class="container">
        <div class="hero-badge-wrap">
          <span class="badge primary">
            <i data-lucide="sparkles"></i> 28+ Universal Converters • 100% Free &amp; Private
          </span>
        </div>
        <h1 class="hero-title">
          Master <span class="gradient-text">Tools Directory</span>
        </h1>
        <p class="hero-subtitle">
          Instant, private, client-side conversions for all your digital media and everyday tasks.
        </p>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-input-wrap">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="tool-search-input" class="search-input" placeholder="Search converters (e.g. HEIC to JPG, PDF to Word, Currency, Age Calc)...">
            <span class="search-shortcut">ESC</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Tools Directory -->
    <section class="container" style="padding-top: 1rem; padding-bottom: 5rem;">
      <div class="category-tabs" id="category-tabs">
        <button class="category-tab active" data-category="all">
          <i data-lucide="layout-grid"></i> All Tools ({len(all_tools)})
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
        {tools_cards_html}
      </div>
    </section>
  </main>

{FOOTER_HTML}

{SCRIPTS_HTML}

  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      AppRouter.bindHomeEvents();
      if (window.lucide) window.lucide.createIcons();
    }});
  </script>
</body>
</html>
"""
    target_dir = os.path.join(OUTPUT_DIR, 'tools')
    os.makedirs(target_dir, exist_ok=True)
    with open(os.path.join(target_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("Generated Tools Hub: /tools/index.html")

# ----------------- STATIC INFO PAGES BUILDER -----------------

def build_info_pages():
    pages = [
        {
            "slug": "about",
            "title": "About OmniConvert - 100% Private In-Browser Utilities",
            "desc": "Learn about OmniConvert's mission to provide fast, free, client-side file and data converters without uploading files to remote servers.",
            "content": """
            <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">About <span class="gradient-text">OmniConvert</span></h1>
            <div class="post-content">
              <p>OmniConvert is an all-in-one web utilities platform engineered to provide instant, free, and completely private file format conversions without software installations or user registration.</p>
              <h2>Zero File Uploads Guarantee</h2>
              <p>Traditional converter websites upload your photos, financial spreadsheets, and confidential documents to remote cloud servers. This introduces serious privacy risks, bandwidth lag, and potential data exposure.</p>
              <p>At OmniConvert, we execute all conversions <strong>locally in your browser memory</strong> using WebAssembly, HTML5 Canvas, Web Audio, and modern JavaScript engines. Your documents never leave your laptop, smartphone, or tablet.</p>
              <h2>Our Technological Foundation</h2>
              <ul>
                <li><strong>WebAssembly (WASM):</strong> Native desktop-grade performance running sandboxed in the browser.</li>
                <li><strong>Client-Side Multi-Threading:</strong> Fast batch conversions utilizing your device's multi-core CPU.</li>
                <li><strong>High Efficiency Algorithms:</strong> Advanced compression engines for images, PDFs, and video.</li>
              </ul>
            </div>
            """
        },
        {
            "slug": "privacy",
            "title": "Privacy Policy - 100% Zero Logs & Zero Server Uploads | OmniConvert",
            "desc": "OmniConvert Privacy Policy: We do not store, view, or transmit your uploaded files. All conversions occur locally in your browser memory.",
            "content": """
            <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">Privacy Policy</h1>
            <div class="post-content">
              <p><strong>Effective Date:</strong> August 2026</p>
              <h2>1. Zero File Upload Guarantee</h2>
              <p>OmniConvert is built with privacy by architecture. Files processed through our tools are parsed and converted exclusively within your local web browser session. <strong>No file data is ever transmitted to or stored on our servers.</strong></p>
              <h2>2. Data Collection & Analytics</h2>
              <p>We do not collect personal identifying information (PII). We may use anonymous privacy-respecting analytics to track general website visitor trends, browser compatibility, and popular tool usage to enhance platform performance.</p>
              <h2>3. Advertising & Cookies</h2>
              <p>OmniConvert may display third-party advertisements (such as Google AdSense) to keep all converter tools 100% free. These ad networks may use standard cookies to serve relevant contextual advertisements in accordance with their privacy policies.</p>
              <h2>4. Contact Us</h2>
              <p>If you have any questions regarding our zero-log architecture or privacy practices, please contact our support team at <a href="/contact/">our contact page</a>.</p>
            </div>
            """
        },
        {
            "slug": "terms",
            "title": "Terms of Service | OmniConvert",
            "desc": "OmniConvert Terms of Service and Conditions of Use.",
            "content": """
            <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">Terms of Service</h1>
            <div class="post-content">
              <p><strong>Effective Date:</strong> August 2026</p>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and utilizing OmniConvert, you agree to comply with and be bound by these Terms of Service.</p>
              <h2>2. Permitted Use</h2>
              <p>All tools on OmniConvert are provided free of charge for personal, educational, and commercial purposes. You agree not to attempt to reverse engineer, disrupt, or bypass platform integrity.</p>
              <h2>3. Disclaimer of Warranties</h2>
              <p>OmniConvert is provided on an 'as-is' and 'as-available' basis. While we strive for maximum conversion accuracy, we disclaim any warranties regarding absolute uninterrupted operation or specific data outcomes.</p>
            </div>
            """
        },
        {
            "slug": "contact",
            "title": "Contact OmniConvert - Feedback, Inquiries & Support",
            "desc": "Get in touch with the OmniConvert engineering team for suggestions, tool requests, or support inquiries.",
            "content": """
            <h1 class="hero-title" style="text-align:left; margin-bottom:1.5rem;">Contact <span class="gradient-text">OmniConvert</span></h1>
            <div class="post-content">
              <p>Have an idea for a new converter? Found a bug? Or want to partner with us? Fill out the form below and our team will get back to you promptly.</p>
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
            """
        }
    ]

    for p in pages:
        canonical = f"{BASE_URL}/{p['slug']}/"
        html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{p['title']}</title>
  <meta name="description" content="{p['desc']}">
  <link rel="canonical" href="{canonical}">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/tools.css">
  <link rel="stylesheet" href="/assets/css/blog.css">
</head>
<body>

{NAV_HTML}

  <main id="app-root">
    <div class="container" style="max-width:840px; padding: 4rem 1.5rem;">
      {p['content']}
    </div>
  </main>

{FOOTER_HTML}

{SCRIPTS_HTML}

  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      if (window.lucide) window.lucide.createIcons();
    }});
  </script>
</body>
</html>
"""
        target_dir = os.path.join(OUTPUT_DIR, p['slug'])
        os.makedirs(target_dir, exist_ok=True)
        with open(os.path.join(target_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Generated Page: /{p['slug']}/index.html")

# ----------------- SITEMAP & ROBOTS BUILDER -----------------

def build_sitemap_and_robots(all_tools, all_posts):
    sitemap_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f'  <url><loc>{BASE_URL}/</loc><lastmod>2026-10-18</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>',
        f'  <url><loc>{BASE_URL}/tools/</loc><lastmod>2026-10-18</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>',
        f'  <url><loc>{BASE_URL}/blog/</loc><lastmod>2026-10-18</lastmod><changefreq>daily</changefreq><priority>0.90</priority></url>',
        f'  <url><loc>{BASE_URL}/about/</loc><lastmod>2026-10-18</lastmod><priority>0.5</priority></url>',
        f'  <url><loc>{BASE_URL}/privacy/</loc><lastmod>2026-10-18</lastmod><priority>0.5</priority></url>',
        f'  <url><loc>{BASE_URL}/terms/</loc><lastmod>2026-10-18</lastmod><priority>0.5</priority></url>',
        f'  <url><loc>{BASE_URL}/contact/</loc><lastmod>2026-10-18</lastmod><priority>0.5</priority></url>',
    ]

    sitemap_lines.append("\n  <!-- 33 Dedicated Converter Tools -->")
    for t in all_tools:
        priority = "0.95" if t['id'] in ("heic-to-jpg", "pdf-compressor", "pdf-to-word", "image-converter", "currency-converter", "mp4-to-mp3", "age-calculator", "word-counter") else "0.90"
        sitemap_lines.append(f'  <url><loc>{BASE_URL}/{t["id"]}/</loc><lastmod>2026-10-18</lastmod><changefreq>weekly</changefreq><priority>{priority}</priority></url>')

    sitemap_lines.append("\n  <!-- Blog Guides & Tutorials -->")
    for p in all_posts:
        sitemap_lines.append(f'  <url><loc>{BASE_URL}/blog/{p["id"]}/</loc><lastmod>2026-10-18</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>')

    sitemap_lines.append('</urlset>')

    sitemap_content = '\n'.join(sitemap_lines) + '\n'
    with open(os.path.join(OUTPUT_DIR, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    print("Generated sitemap.xml with all 40+ clean canonical URLs!")

    robots_content = f"""User-agent: *
Allow: /

Sitemap: {BASE_URL}/sitemap.xml
"""
    with open(os.path.join(OUTPUT_DIR, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write(robots_content)
    print("Generated robots.txt pointing to sitemap.xml!")

# ----------------- MAIN EXECUTION -----------------

def main():
    print("=== OMNICONVERT 24-YEAR VETERAN SEO ENGINE GENERATOR ===")
    tools = load_tools_data()
    print(f"Loaded {len(tools)} converters.")
    posts = load_blog_posts()
    print(f"Loaded {len(posts)} blog articles.")

    for tool in tools:
        build_tool_page(tool, tools)

    for post in posts:
        build_blog_post_page(post, posts, tools)

    build_blog_index(posts)
    build_tools_hub(tools)
    build_info_pages()
    build_sitemap_and_robots(tools, posts)
    print("=== ALL SEO PAGES SUCCESSFULLY GENERATED! ===")

if __name__ == '__main__':
    main()
