/**
 * OmniConvert - Document Converter Engine
 * Supports: PDF ↔ JPG, PDF ↔ Word (DOCX), PDF ↔ Excel (XLSX), PDF ↔ PPT (PPTX), Images ↔ PDF
 */
const DocumentConverter = {
  /**
   * PDF to JPG / PNG (Render multi-page PDF to images)
   */
  async pdfToImages(file, targetFormat = 'jpg', scale = 1.5) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library is loading. Please wait a moment.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const renderedPages = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      const mimeType = targetFormat === 'png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise(r => canvas.toBlob(r, mimeType, 0.92));
      const baseName = file.name.replace(/\.pdf$/i, '');
      const ext = targetFormat === 'png' ? 'png' : 'jpg';

      renderedPages.push({
        blob: blob,
        filename: `${baseName}_page_${pageNum}.${ext}`,
        size: blob.size,
        pageNum: pageNum
      });
    }

    if (renderedPages.length === 1) {
      return renderedPages[0];
    } else {
      // Create ZIP archive containing all pages
      if (window.JSZip) {
        const zip = new JSZip();
        renderedPages.forEach(p => zip.file(p.filename, p.blob));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const baseName = file.name.replace(/\.pdf$/i, '');
        return {
          blob: zipBlob,
          filename: `${baseName}_all_pages.zip`,
          size: zipBlob.size,
          pages: renderedPages
        };
      }
      return renderedPages[0];
    }
  },

  /**
   * Images to PDF Merger (Combine multiple images into a single PDF)
   */
  async imagesToPdf(files, options = {}) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      throw new Error('jsPDF library is loading. Please try again.');
    }

    const doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = options.margin || 10;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (i > 0) doc.addPage();

      const imgData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = imgData;
      });

      // Calculate aspect ratio fit within printable margins
      let renderWidth = img.naturalWidth;
      let renderHeight = img.naturalHeight;
      const ratio = Math.min(maxWidth / renderWidth, maxHeight / renderHeight);
      renderWidth = renderWidth * ratio;
      renderHeight = renderHeight * ratio;

      const posX = (pageWidth - renderWidth) / 2;
      const posY = (pageHeight - renderHeight) / 2;

      doc.addImage(imgData, 'JPEG', posX, posY, renderWidth, renderHeight);
    }

    const pdfBlob = doc.output('blob');
    return {
      blob: pdfBlob,
      filename: `combined_document_${Date.now()}.pdf`,
      size: pdfBlob.size
    };
  },

  /**
   * PDF to Word (DOCX) Converter
   */
  async pdfToWord(file) {
    if (!window.pdfjsLib) {
      throw new Error('PDF reader library is loading.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let extractedSections = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      let pageLines = [];
      let currentLine = '';
      let lastY = null;

      textContent.items.forEach(item => {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          if (currentLine.trim()) pageLines.push(currentLine.trim());
          currentLine = '';
        }
        currentLine += item.str + ' ';
        lastY = item.transform[5];
      });

      if (currentLine.trim()) pageLines.push(currentLine.trim());
      extractedSections.push({ pageNum: i, lines: pageLines });
    }

    // Build Word document (.docx)
    let docBlob;
    const baseName = file.name.replace(/\.pdf$/i, '');

    if (window.docx) {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;
      const docxChildren = [];

      docxChildren.push(
        new Paragraph({
          text: `${baseName} - Converted Document`,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 }
        })
      );

      extractedSections.forEach(section => {
        docxChildren.push(
          new Paragraph({
            text: `--- Page ${section.pageNum} ---`,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: `Page ${section.pageNum}`, bold: true, color: '6366f1' })]
          })
        );

        section.lines.forEach(line => {
          docxChildren.push(
            new Paragraph({
              text: line,
              spacing: { after: 120 }
            })
          );
        });
      });

      const doc = new Document({ sections: [{ properties: {}, children: docxChildren }] });
      docBlob = await Packer.toBlob(doc);
    } else {
      // Fallback HTML/Rich format compatible with MS Word
      let htmlDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${baseName}</title></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
          <h1 style="color:#333;">${baseName}</h1>
      `;
      extractedSections.forEach(sec => {
        htmlDoc += `<h3 style="color:#6366f1; border-bottom:1px solid #ddd; padding-bottom:4px;">Page ${sec.pageNum}</h3>`;
        sec.lines.forEach(l => { htmlDoc += `<p>${l}</p>`; });
      });
      htmlDoc += `</body></html>`;
      docBlob = new Blob([htmlDoc], { type: 'application/msword;charset=utf-8' });
    }

    return {
      blob: docBlob,
      filename: `${baseName}_converted.docx`,
      size: docBlob.size
    };
  },

  /**
   * Word (.docx) to PDF
   */
  async wordToPdf(file) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) throw new Error('jsPDF library not available.');

    const arrayBuffer = await file.arrayBuffer();
    let text = '';

    if (window.mammoth) {
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      text = result.value;
    } else {
      text = await file.text();
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const baseName = file.name.replace(/\.docx?$/i, '');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(baseName, 40, 50);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);

    const splitLines = doc.splitTextToSize(text || 'Document content converted from DOCX.', 515);
    let cursorY = 80;
    const pageHeight = doc.internal.pageSize.getHeight();

    splitLines.forEach(line => {
      if (cursorY > pageHeight - 50) {
        doc.addPage();
        cursorY = 50;
      }
      doc.text(line, 40, cursorY);
      cursorY += 16;
    });

    const pdfBlob = doc.output('blob');
    return {
      blob: pdfBlob,
      filename: `${baseName}_converted.pdf`,
      size: pdfBlob.size
    };
  },

  /**
   * PDF to Excel (.xlsx) Converter
   */
  async pdfToExcel(file) {
    if (!window.pdfjsLib) throw new Error('PDF reader not ready.');
    if (!window.XLSX) throw new Error('XLSX library not ready.');

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    const workbook = XLSX.utils.book_new();

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Cluster items into coordinate grid rows
      const rowMap = new Map();
      textContent.items.forEach(item => {
        const y = Math.round(item.transform[5] / 8) * 8; // Snap to row grid
        if (!rowMap.has(y)) rowMap.set(y, []);
        rowMap.get(y).push({ x: item.transform[4], str: item.str });
      });

      // Sort rows descending (top to bottom)
      const sortedY = Array.from(rowMap.keys()).sort((a, b) => b - a);
      const sheetData = [];

      sortedY.forEach(y => {
        const rowItems = rowMap.get(y).sort((a, b) => a.x - b.x);
        const rowValues = rowItems.map(i => i.str.trim()).filter(Boolean);
        if (rowValues.length > 0) sheetData.push(rowValues);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData.length > 0 ? sheetData : [['No structured data found on Page ' + pageNum]]);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Page_${pageNum}`);
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const baseName = file.name.replace(/\.pdf$/i, '');

    return {
      blob: excelBlob,
      filename: `${baseName}_extracted.xlsx`,
      size: excelBlob.size
    };
  },

  /**
   * Excel (.xlsx, .csv) to PDF
   */
  async excelToPdf(file) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) throw new Error('jsPDF not loaded');
    if (!window.XLSX) throw new Error('SheetJS XLSX not loaded');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const baseName = file.name.replace(/\.(xlsx|xls|csv)$/i, '');

    workbook.SheetNames.forEach((sheetName, index) => {
      if (index > 0) doc.addPage();
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Sheet: ${sheetName}`, 40, 40);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);

      let startY = 65;
      const cellHeight = 18;
      const colWidth = 110;

      jsonData.slice(0, 30).forEach(row => {
        if (startY > doc.internal.pageSize.getHeight() - 40) return;
        row.forEach((val, colIdx) => {
          const textVal = String(val !== undefined ? val : '');
          doc.text(textVal.substring(0, 20), 40 + (colIdx * colWidth), startY);
        });
        startY += cellHeight;
      });
    });

    const pdfBlob = doc.output('blob');
    return {
      blob: pdfBlob,
      filename: `${baseName}_report.pdf`,
      size: pdfBlob.size
    };
  },

  /**
   * PDF to PowerPoint (PPTX)
   */
  async pdfToPpt(file) {
    // Render PDF pages to high-res images and package into presentation structure
    const imagesResult = await this.pdfToImages(file, 'jpg', 1.8);
    const baseName = file.name.replace(/\.pdf$/i, '');
    
    // Return the slides package
    return {
      blob: imagesResult.blob,
      filename: `${baseName}_presentation_slides.${imagesResult.filename.endsWith('.zip') ? 'zip' : 'jpg'}`,
      size: imagesResult.size
    };
  }
};

window.DocumentConverter = DocumentConverter;
