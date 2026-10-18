/**
 * OmniConvert - Data Format Converter Engine
 * Supports: CSV ↔ Excel (XLSX), CSV ↔ JSON, JSON ↔ XML
 */
const DataConverter = {
  /**
   * CSV to Excel (.xlsx)
   */
  async csvToExcel(fileOrText) {
    if (!window.XLSX) throw new Error('SheetJS XLSX library is not loaded');

    let csvText = '';
    let fileName = 'data.csv';

    if (typeof fileOrText === 'string') {
      csvText = fileOrText;
    } else {
      csvText = await fileOrText.text();
      fileName = fileOrText.name;
    }

    const workbook = XLSX.read(csvText, { type: 'string' });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const baseName = fileName.replace(/\.csv$/i, '');

    return {
      blob: blob,
      filename: `${baseName}.xlsx`,
      size: blob.size
    };
  },

  /**
   * Excel (.xlsx, .xls) to CSV
   */
  async excelToCsv(file) {
    if (!window.XLSX) throw new Error('SheetJS XLSX library is not loaded');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const baseName = file.name.replace(/\.(xlsx|xls)$/i, '');

    return {
      blob: blob,
      text: csvOutput,
      filename: `${baseName}.csv`,
      size: blob.size
    };
  },

  /**
   * CSV to JSON
   */
  csvToJson(csvString) {
    if (window.Papa) {
      const parsed = Papa.parse(csvString.trim(), { header: true, skipEmptyLines: true });
      return JSON.stringify(parsed.data, null, 2);
    } else {
      // Fallback native CSV parser
      const lines = csvString.trim().split('\n');
      if (lines.length === 0) return '[]';
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] ? row[index].trim().replace(/^["']|["']$/g, '') : '';
        });
        result.push(obj);
      }
      return JSON.stringify(result, null, 2);
    }
  },

  /**
   * JSON to CSV
   */
  jsonToCsv(jsonString) {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (window.Papa) {
        return Papa.unparse(data);
      } else {
        const items = Array.isArray(data) ? data : [data];
        if (items.length === 0) return '';
        const headers = Object.keys(items[0]);
        const csvRows = [headers.join(',')];

        items.forEach(item => {
          const values = headers.map(header => {
            const val = item[header] !== undefined ? String(item[header]) : '';
            return `"${val.replace(/"/g, '""')}"`;
          });
          csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
      }
    } catch (e) {
      throw new Error('Invalid JSON format: ' + e.message);
    }
  },

  /**
   * JSON to XML
   */
  jsonToXml(jsonString, rootName = 'root') {
    try {
      const obj = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      
      if (window.fxparser && window.fxparser.XMLBuilder) {
        const builder = new fxparser.XMLBuilder({
          ignoreAttributes: false,
          format: true,
          indentBy: '  '
        });
        const wrapped = { [rootName]: obj };
        return `<?xml version="1.0" encoding="UTF-8"?>\n` + builder.build(wrapped);
      }

      // Native XML Generator
      function toXml(data, name) {
        if (Array.isArray(data)) {
          return data.map(item => toXml(item, 'item')).join('\n');
        } else if (typeof data === 'object' && data !== null) {
          let inner = '';
          for (let key in data) {
            inner += toXml(data[key], key);
          }
          return `<${name}>${inner}</${name}>`;
        } else {
          const safe = String(data)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return `<${name}>${safe}</${name}>`;
        }
      }

      return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n` + toXml(obj, 'data') + `\n</${rootName}>`;
    } catch (e) {
      throw new Error('Invalid JSON for XML conversion: ' + e.message);
    }
  },

  /**
   * XML to JSON
   */
  xmlToJson(xmlString) {
    try {
      if (window.fxparser && window.fxparser.XMLParser) {
        const parser = new fxparser.XMLParser({ ignoreAttributes: false });
        const jsonObj = parser.parse(xmlString);
        return JSON.stringify(jsonObj, null, 2);
      }

      // DOMParser fallback
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      function xmlNodeToObj(node) {
        if (node.nodeType === 3) return node.nodeValue.trim();
        const obj = {};
        if (node.childNodes && node.childNodes.length > 0) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child.nodeType === 3 && node.childNodes.length === 1) {
              return child.nodeValue.trim();
            }
            if (child.nodeType === 1) {
              const nodeName = child.nodeName;
              if (obj[nodeName] === undefined) {
                obj[nodeName] = xmlNodeToObj(child);
              } else {
                if (!Array.isArray(obj[nodeName])) {
                  obj[nodeName] = [obj[nodeName]];
                }
                obj[nodeName].push(xmlNodeToObj(child));
              }
            }
          }
        }
        return obj;
      }

      const res = xmlNodeToObj(xmlDoc.documentElement);
      return JSON.stringify({ [xmlDoc.documentElement.nodeName]: res }, null, 2);
    } catch (e) {
      throw new Error('Invalid XML: ' + e.message);
    }
  }
};

window.DataConverter = DataConverter;
