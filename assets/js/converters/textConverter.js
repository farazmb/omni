/**
 * OmniConvert - Text & Code Converters Engine
 * Supports: Markdown ↔ HTML, Case Converter, Base64, URL Encode/Decode, TTS
 */
const TextConverter = {
  /**
   * Markdown to HTML
   */
  markdownToHtml(mdText) {
    if (window.marked) {
      return marked.parse(mdText);
    }
    // Simple regex fallback
    return mdText
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  },

  /**
   * HTML to Markdown
   */
  htmlToMarkdown(htmlText) {
    if (window.TurndownService) {
      const turndownService = new TurndownService();
      return turndownService.turndown(htmlText);
    }
    // Fallback simple clean
    const temp = document.createElement('div');
    temp.innerHTML = htmlText;
    return temp.innerText || temp.textContent;
  },

  /**
   * Case Converter
   */
  convertCase(text, caseType) {
    if (!text) return '';
    switch (caseType) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'titlecase':
        return text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      case 'sentencecase':
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      case 'camelcase':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
          .replace(/\s+/g, '');
      case 'snakecase':
        return text
          .replace(/\s+/g, '_')
          .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .toLowerCase();
      case 'kebabcase':
        return text
          .replace(/\s+/g, '-')
          .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase();
      case 'alternating':
        return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
      default:
        return text;
    }
  },

  /**
   * Base64 Encode & Decode
   */
  base64Encode(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      throw new Error('Base64 Encoding failed: ' + e.message);
    }
  },

  base64Decode(str) {
    try {
      return decodeURIComponent(escape(atob(str.trim())));
    } catch (e) {
      throw new Error('Invalid Base64 string');
    }
  },

  /**
   * URL Encode & Decode
   */
  urlEncode(str) {
    return encodeURIComponent(str);
  },

  urlDecode(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      throw new Error('Invalid URL encoded string');
    }
  },

  /**
   * Text-to-Speech (TTS)
   */
  speakText(text, options = {}) {
    if (!('speechSynthesis' in window)) {
      throw new Error('Text-to-Speech is not supported in this browser.');
    }
    if (!text || !text.trim()) {
      throw new Error('Please enter some text to speak.');
    }
    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    if (options.voiceIndex !== undefined && !isNaN(options.voiceIndex)) {
      const voices = window.speechSynthesis.getVoices();
      if (voices[options.voiceIndex]) {
        utterance.voice = voices[options.voiceIndex];
      }
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};

window.TextConverter = TextConverter;
