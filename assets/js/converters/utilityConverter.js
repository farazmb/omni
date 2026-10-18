/**
 * OmniConvert - Everyday Utility Converters & Calculators Engine
 * Supports: PDF Compressor, Word/Character Counter, Age & Date Difference Calculator
 */
const UtilityConverter = {
  /**
   * Compress PDF document by re-rendering pages with optimized JPEG compression
   */
  async compressPdf(file, compressionLevel = 'medium') {
    if (!window.pdfjsLib || !window.jspdf) {
      throw new Error('PDF processing libraries not ready.');
    }

    const { jsPDF } = window.jspdf;
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    let scale = 1.2;
    let quality = 0.7;

    if (compressionLevel === 'high') { // Extreme compression
      scale = 0.9;
      quality = 0.5;
    } else if (compressionLevel === 'low') { // High quality
      scale = 1.5;
      quality = 0.85;
    }

    const doc = new jsPDF({ unit: 'pt' });

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      if (pageNum > 1) doc.addPage();

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      const imgData = canvas.toDataURL('image/jpeg', quality);
      doc.addImage(imgData, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    }

    const compressedBlob = doc.output('blob');
    const baseName = file.name.replace(/\.pdf$/i, '');

    return {
      blob: compressedBlob,
      filename: `${baseName}_compressed.pdf`,
      size: compressedBlob.size,
      originalSize: file.size
    };
  },

  /**
   * Word & Text Analytics
   */
  analyzeText(text) {
    if (!text || !text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: '0 sec',
        speakingTime: '0 sec',
        topWords: []
      };
    }

    const trimmed = text.trim();
    const wordsArray = trimmed.match(/\b[a-zA-Z0-9_\u0600-\u06FF'-]+\b/g) || [];
    const wordsCount = wordsArray.length;
    const charactersCount = text.length;
    const charactersNoSpacesCount = text.replace(/\s+/g, '').length;
    const sentencesCount = (text.match(/[^.!?]+[.!?]+/g) || []).length || (wordsCount > 0 ? 1 : 0);
    const paragraphsCount = (text.split(/\n+/).filter(p => p.trim().length > 0)).length;

    // Speeds: Reading ~200 wpm, Speaking ~130 wpm
    const readingMins = wordsCount / 200;
    const speakingMins = wordsCount / 130;

    const formatTime = (mins) => {
      if (mins < 1) return `${Math.round(mins * 60)} sec`;
      return `${Math.floor(mins)} min ${Math.round((mins % 1) * 60)} sec`;
    };

    // Keyword density frequency
    const freqMap = {};
    wordsArray.forEach(w => {
      const lower = w.toLowerCase();
      if (lower.length > 2) {
        freqMap[lower] = (freqMap[lower] || 0) + 1;
      }
    });

    const topWords = Object.keys(freqMap)
      .sort((a, b) => freqMap[b] - freqMap[a])
      .slice(0, 5)
      .map(k => ({ word: k, count: freqMap[k] }));

    return {
      words: wordsCount,
      characters: charactersCount,
      charactersNoSpaces: charactersNoSpacesCount,
      sentences: sentencesCount,
      paragraphs: paragraphsCount,
      readingTime: formatTime(readingMins),
      speakingTime: formatTime(speakingMins),
      topWords: topWords
    };
  },

  /**
   * Age Calculator (Detailed years, months, days, next birthday countdown)
   */
  calculateAge(birthDateStr, targetDateStr = null) {
    const birthDate = new Date(birthDateStr);
    const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();

    if (isNaN(birthDate.getTime())) throw new Error('Invalid birth date');

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total difference in milliseconds
    const diffMs = targetDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Next Birthday Countdown
    const nextBirthday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < targetDate) {
      nextBirthday.setFullYear(targetDate.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday - targetDate) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysToBirthday
    };
  },

  /**
   * Date Difference Calculator
   */
  calculateDateDiff(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error('Invalid dates provided');

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    return {
      totalDays,
      totalWeeks,
      remainingDays
    };
  }
};

window.UtilityConverter = UtilityConverter;
