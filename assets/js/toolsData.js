/**
 * OmniConvert - Complete Tools Directory (28+ Tools Across 7 Categories) & SEO Metadata
 */
const TOOLS_DATA = [
  // ==================== 1. IMAGE CONVERTERS ====================
  {
    id: "image-converter",
    name: "Image Format Converter",
    shortTitle: "Image Converter",
    badge: "Popular",
    category: "image",
    icon: "image",
    accentColor: "image",
    desc: "Convert between PNG, JPG, WebP, AVIF, and SVG with custom quality control and batch ZIP downloads.",
    metaTitle: "Free Image Converter - PNG, JPG, WebP, AVIF, SVG Online",
    metaDesc: "Convert images between PNG, JPG, WebP, AVIF and SVG instantly. Adjust compression quality, preserve transparency, and batch download as ZIP.",
    acceptedTypes: "image/png,image/jpeg,image/webp,image/avif,image/svg+xml",
    defaultTarget: "webp",
    availableTargets: ["jpg", "png", "webp", "avif"],
    hasQualityControl: true,
    faqs: [
      { q: "Which image format offers the best compression?", a: "WebP and AVIF provide up to 30-50% smaller file sizes compared to traditional JPG and PNG while retaining superior visual quality." },
      { q: "Does converting PNG to JPG remove transparency?", a: "Yes, JPG does not support alpha transparency. Any transparent areas will be filled with a clean white background." }
    ],
    howTo: [
      { step: "1", title: "Select Images", desc: "Upload single or multiple image files (PNG, JPG, WebP, AVIF, SVG)." },
      { step: "2", title: "Choose Format & Quality", desc: "Pick your desired output format and adjust compression." },
      { step: "3", title: "Convert & Download", desc: "Download converted images individually or as a single ZIP archive." }
    ]
  },
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG Converter",
    shortTitle: "HEIC to JPG",
    badge: "iPhone High Demand",
    category: "image",
    icon: "smartphone",
    accentColor: "image",
    desc: "Convert Apple iPhone HEIC and HEIF photos to universal JPG or PNG format with full quality.",
    metaTitle: "HEIC to JPG Converter - Convert iPhone Photos Online Free",
    metaDesc: "Easily convert Apple iOS HEIC photos to high-quality JPG or PNG files online. Batch processing, EXIF preservation, 100% private in-browser tool.",
    acceptedTypes: ".heic,.heif,image/heic,image/heif",
    defaultTarget: "jpg",
    availableTargets: ["jpg", "png"],
    hasQualityControl: true,
    faqs: [
      { q: "Why does Apple use HEIC format?", a: "Apple uses HEIC to cut photo storage sizes in half with 16-bit color depth." },
      { q: "Can I open HEIC photos on Windows?", a: "Converting to JPG makes them universally compatible with every Windows, Android, and web app." }
    ],
    howTo: [
      { step: "1", title: "Upload HEIC Photos", desc: "Drag & drop your .heic photos from your iPhone or Mac." },
      { step: "2", title: "Set Output Format", desc: "Select JPG or PNG and set quality." },
      { step: "3", title: "Download", desc: "Click convert to save your standard images." }
    ]
  },
  {
    id: "svg-converter",
    name: "SVG Vector & Raster Converter",
    shortTitle: "SVG Converter",
    badge: "Vector Tool",
    category: "image",
    icon: "shapes",
    accentColor: "image",
    desc: "Convert SVG vectors to high-resolution PNG/JPG (up to 8x scale) or vectorize raster images to clean SVG.",
    metaTitle: "SVG Converter - Convert SVG to PNG/JPG or Vectorize to SVG",
    metaDesc: "Convert scalable vector graphics (SVG) into high-resolution PNG, JPG, and WebP, or trace bitmap logos to SVG vector paths online.",
    acceptedTypes: ".svg,image/svg+xml,image/png,image/jpeg,image/webp",
    defaultTarget: "png",
    availableTargets: ["png", "jpg", "webp", "svg"],
    hasQualityControl: true,
    faqs: [
      { q: "Can I export high-res PNG from SVG?", a: "Yes, you can scale up to 8x for ultra crisp print quality." }
    ],
    howTo: [
      { step: "1", title: "Upload Graphic", desc: "Select an SVG or PNG/JPG image." },
      { step: "2", title: "Select Output Scale", desc: "Choose 1x, 2x, 4x, or 8x scale." },
      { step: "3", title: "Export", desc: "Download your sharp vector or raster asset." }
    ]
  },
  {
    id: "image-resizer",
    name: "Image Resizer & Compressor",
    shortTitle: "Image Resizer",
    badge: "Design",
    category: "image",
    icon: "crop",
    accentColor: "image",
    desc: "Resize image dimensions by pixels or percentages, lock aspect ratio, and compress file size in seconds.",
    metaTitle: "Image Resizer - Resize & Compress Images Online Free",
    metaDesc: "Resize image width and height online. Batch resize photos by exact dimensions or scale percentages with aspect ratio lock.",
    acceptedTypes: "image/*",
    defaultTarget: "jpg",
    availableTargets: ["jpg", "png", "webp"],
    hasQualityControl: true,
    isSpecialUI: "resizer",
    faqs: [
      { q: "Does resizing maintain aspect ratio?", a: "Yes, our tool automatically calculates proportional height when you change width." }
    ],
    howTo: [
      { step: "1", title: "Upload Image", desc: "Select photo to resize." },
      { step: "2", title: "Enter Dimensions", desc: "Specify width/height in pixels or percentage." },
      { step: "3", title: "Download", desc: "Save your perfectly sized image." }
    ]
  },

  // ==================== 2. DOCUMENT CONVERTERS ====================
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG / Image Extractor",
    shortTitle: "PDF to JPG",
    badge: "High Demand",
    category: "document",
    icon: "file-text",
    accentColor: "document",
    desc: "Extract all pages from any PDF document and render them into crisp, high-resolution JPG or PNG images.",
    metaTitle: "PDF to JPG Converter - Convert PDF Pages to Images Online",
    metaDesc: "Convert PDF pages to high-quality JPG and PNG images online. Free multi-page extraction, high DPI rendering, and ZIP download.",
    acceptedTypes: "application/pdf,.pdf",
    defaultTarget: "jpg",
    availableTargets: ["jpg", "png"],
    hasQualityControl: true,
    faqs: [
      { q: "Can I convert multi-page PDF documents?", a: "Yes! Every page is rendered into an individual image and can be downloaded in a ZIP file." }
    ],
    howTo: [
      { step: "1", title: "Upload PDF", desc: "Drag and drop your PDF document." },
      { step: "2", title: "Choose Format", desc: "Pick JPG or PNG." },
      { step: "3", title: "Download Pages", desc: "Save pages or download complete ZIP." }
    ]
  },
  {
    id: "jpg-to-pdf",
    name: "Images to PDF Merger",
    shortTitle: "Images to PDF",
    badge: "Essential",
    category: "document",
    icon: "file-plus",
    accentColor: "document",
    desc: "Combine multiple JPG, PNG, and WebP images into a single professional, paginated PDF document.",
    metaTitle: "Images to PDF Converter - Combine Photos into PDF Online",
    metaDesc: "Merge multiple JPG, PNG, and WebP images into a single clean PDF document. Customize orientation and page margins.",
    acceptedTypes: "image/jpeg,image/png,image/webp,image/avif",
    defaultTarget: "pdf",
    availableTargets: ["pdf"],
    hasQualityControl: false,
    faqs: [
      { q: "Can I merge multiple photos into one PDF?", a: "Yes, select all your photos and click generate to combine them." }
    ],
    howTo: [
      { step: "1", title: "Add Images", desc: "Upload multiple photos." },
      { step: "2", title: "Arrange", desc: "Reorder images as desired." },
      { step: "3", title: "Merge", desc: "Download single unified PDF." }
    ]
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor & Optimizer",
    shortTitle: "PDF Compressor",
    badge: "High Demand",
    category: "document",
    icon: "minimize",
    accentColor: "document",
    desc: "Compress bulky PDF documents and optimize images to drastically reduce file size for email and web uploads.",
    metaTitle: "PDF Compressor - Reduce PDF File Size Online Free",
    metaDesc: "Compress PDF files online without losing text readability. Select low, medium, or high compression levels.",
    acceptedTypes: "application/pdf,.pdf",
    defaultTarget: "pdf",
    availableTargets: ["pdf"],
    hasQualityControl: true,
    faqs: [
      { q: "How much size can I save on a PDF?", a: "Scanned documents and image-heavy PDFs often shrink by 50% to 80%." }
    ],
    howTo: [
      { step: "1", title: "Upload PDF", desc: "Select your large PDF file." },
      { step: "2", title: "Select Compression", desc: "Choose Balanced or Maximum compression." },
      { step: "3", title: "Save PDF", desc: "Download your compressed PDF." }
    ]
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word (DOCX) Converter",
    shortTitle: "PDF to Word",
    badge: "Office Suite",
    category: "document",
    icon: "file-code",
    accentColor: "document",
    desc: "Extract text, headings, and formatted content from PDF files into editable Microsoft Word (.docx) documents.",
    metaTitle: "PDF to Word Converter - Convert PDF to DOCX Online Free",
    metaDesc: "Convert PDF documents to editable Microsoft Word (.docx) files online for free. Clean text extraction, 100% private.",
    acceptedTypes: "application/pdf,.pdf",
    defaultTarget: "docx",
    availableTargets: ["docx"],
    hasQualityControl: false,
    faqs: [{ q: "Is the output Word file editable?", a: "Yes, open it in Word, Google Docs, or LibreOffice." }],
    howTo: [
      { step: "1", title: "Upload PDF", desc: "Select PDF file." },
      { step: "2", title: "Extract", desc: "Engine converts text structure." },
      { step: "3", title: "Download", desc: "Save editable DOCX." }
    ]
  },
  {
    id: "word-to-pdf",
    name: "Word (DOCX) to PDF Converter",
    shortTitle: "Word to PDF",
    badge: "Office Suite",
    category: "document",
    icon: "file-check",
    accentColor: "document",
    desc: "Convert Microsoft Word (.docx) documents into standardized, secure PDF files.",
    metaTitle: "Word to PDF Converter - Convert DOCX to PDF Online Free",
    metaDesc: "Convert Word DOCX documents to PDF format online. Preserve typography and layout accurately.",
    acceptedTypes: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    defaultTarget: "pdf",
    availableTargets: ["pdf"],
    hasQualityControl: false,
    faqs: [{ q: "Does Word to PDF preserve formatting?", a: "Yes, styles and tables are rendered into PDF." }],
    howTo: [
      { step: "1", title: "Upload Word DOCX", desc: "Select document." },
      { step: "2", title: "Convert", desc: "Render into PDF format." },
      { step: "3", title: "Save", desc: "Download PDF file." }
    ]
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel (XLSX) Converter",
    shortTitle: "PDF to Excel",
    badge: "Data & Tables",
    category: "document",
    icon: "sheet",
    accentColor: "document",
    desc: "Extract tables and tabular numerical data from PDF statements and reports into structured Microsoft Excel (.xlsx) spreadsheets.",
    metaTitle: "PDF to Excel Converter - Extract PDF Tables to XLSX Online",
    metaDesc: "Extract tables from PDF documents into Microsoft Excel XLSX spreadsheets online. Fast, secure, and private.",
    acceptedTypes: "application/pdf,.pdf",
    defaultTarget: "xlsx",
    availableTargets: ["xlsx", "csv"],
    hasQualityControl: false,
    faqs: [{ q: "Can this extract bank statements?", a: "Yes, table rows and columns are parsed into Excel cells." }],
    howTo: [
      { step: "1", title: "Upload PDF", desc: "Select statement or table." },
      { step: "2", title: "Process", desc: "Extract structured rows & columns." },
      { step: "3", title: "Export", desc: "Open in Microsoft Excel or Google Sheets." }
    ]
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF Converter",
    shortTitle: "Excel to PDF",
    badge: "Spreadsheet",
    category: "document",
    icon: "file-spreadsheet",
    accentColor: "document",
    desc: "Convert Excel spreadsheets (.xlsx, .xls) and CSV sheets into clean, printable PDF reports.",
    metaTitle: "Excel to PDF Converter - Convert XLSX to PDF Online",
    metaDesc: "Convert Excel (.xlsx) spreadsheets and CSV files to formatted PDF documents online.",
    acceptedTypes: ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    defaultTarget: "pdf",
    availableTargets: ["pdf"],
    hasQualityControl: false,
    faqs: [{ q: "Can I convert multi-sheet workbooks?", a: "Yes, all sheets are rendered into paginated PDF." }],
    howTo: [
      { step: "1", title: "Upload Excel File", desc: "Select .xlsx or .csv." },
      { step: "2", title: "Convert", desc: "Generate formatted tabular pages." },
      { step: "3", title: "Download", desc: "Save clean PDF document." }
    ]
  },
  {
    id: "pdf-to-ppt",
    name: "PDF to PowerPoint (PPTX) Converter",
    shortTitle: "PDF to PPT",
    badge: "Presentations",
    category: "document",
    icon: "presentation",
    accentColor: "document",
    desc: "Convert PDF slides and presentations into Microsoft PowerPoint (.pptx) presentation decks.",
    metaTitle: "PDF to PowerPoint Converter - Convert PDF to PPTX Online Free",
    metaDesc: "Convert PDF documents into Microsoft PowerPoint presentation decks online.",
    acceptedTypes: "application/pdf,.pdf",
    defaultTarget: "pptx",
    availableTargets: ["pptx"],
    hasQualityControl: false,
    faqs: [{ q: "Are slides formatted in widescreen?", a: "Yes, pages are optimized for presentation view." }],
    howTo: [
      { step: "1", title: "Upload PDF", desc: "Select presentation PDF." },
      { step: "2", title: "Convert", desc: "Render high-res slide deck." },
      { step: "3", title: "Download", desc: "Open in Microsoft PowerPoint." }
    ]
  },

  // ==================== 3. AUDIO & VIDEO TOOLS ====================
  {
    id: "mp4-to-mp3",
    name: "MP4 to MP3 Audio Extractor",
    shortTitle: "MP4 to MP3",
    badge: "Audio Extractor",
    category: "media",
    icon: "music",
    accentColor: "media",
    desc: "Extract audio tracks from MP4, WebM, and MOV video files and save as MP3 with custom bitrates (128k, 192k, 320k).",
    metaTitle: "MP4 to MP3 Converter - Extract Audio from Video Online Free",
    metaDesc: "Extract MP3 audio from MP4, WebM, and MOV videos online. Select audio bitrate (128k, 192k, 320k).",
    acceptedTypes: "video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.mov,.webm,.mkv",
    defaultTarget: "mp3",
    availableTargets: ["mp3", "wav"],
    hasQualityControl: true,
    faqs: [{ q: "What bitrates are available?", a: "128 kbps, 192 kbps, and 320 kbps high-definition." }],
    howTo: [
      { step: "1", title: "Upload Video", desc: "Select MP4, MOV, or WebM." },
      { step: "2", title: "Select Bitrate", desc: "Choose 128k, 192k, or 320k." },
      { step: "3", title: "Save MP3", desc: "Download audio file." }
    ]
  },
  {
    id: "mov-to-mp4",
    name: "MOV to MP4 Video Converter",
    shortTitle: "MOV to MP4",
    badge: "Apple QuickTime",
    category: "media",
    icon: "video",
    accentColor: "media",
    desc: "Convert Apple QuickTime MOV recordings from iPhone and Mac into universally compatible H.264 MP4 videos.",
    metaTitle: "MOV to MP4 Converter - Convert QuickTime MOV to MP4 Online",
    metaDesc: "Convert MOV videos to universal MP4 format online for free. Compatible with all devices.",
    acceptedTypes: "video/quicktime,.mov",
    defaultTarget: "mp4",
    availableTargets: ["mp4", "webm"],
    hasQualityControl: true,
    faqs: [{ q: "Why convert MOV to MP4?", a: "MP4 works across all browsers, smart TVs, and Android devices." }],
    howTo: [
      { step: "1", title: "Upload MOV", desc: "Select iPhone .mov video." },
      { step: "2", title: "Convert", desc: "Transcode to universal H.264 MP4." },
      { step: "3", title: "Download", desc: "Play everywhere." }
    ]
  },
  {
    id: "video-compressor",
    name: "Video Compressor & Optimizer",
    shortTitle: "Video Compressor",
    badge: "Size Reducer",
    category: "media",
    icon: "minimize-2",
    accentColor: "media",
    desc: "Compress large video files (MP4, WebM, MOV) by up to 80% with minimal quality loss for Discord, email, and web.",
    metaTitle: "Video Compressor - Reduce Video File Size Online Free",
    metaDesc: "Compress MP4 and WebM video file size online without losing quality.",
    acceptedTypes: "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
    defaultTarget: "mp4",
    availableTargets: ["mp4", "webm"],
    hasQualityControl: true,
    faqs: [{ q: "How much size is saved?", a: "Between 50% and 85% depending on resolution preset." }],
    howTo: [
      { step: "1", title: "Upload Video", desc: "Select video file." },
      { step: "2", title: "Choose Preset", desc: "Select Low, Medium, or High compression." },
      { step: "3", title: "Compress", desc: "Download optimized video." }
    ]
  },

  // ==================== 4. TEXT & CODE CONVERTERS ====================
  {
    id: "markdown-html",
    name: "Markdown ↔ HTML Converter",
    shortTitle: "Markdown ↔ HTML",
    badge: "Developer Tool",
    category: "text",
    icon: "file-code-2",
    accentColor: "text",
    desc: "Live dual-pane editor converting Markdown into clean HTML markup and HTML back into clean Markdown.",
    metaTitle: "Markdown to HTML Converter - Live Dual Pane Editor Online",
    metaDesc: "Convert Markdown to HTML and HTML to Markdown online. Real-time preview, syntax highlighting, and copy-to-clipboard.",
    acceptedTypes: ".md,.html,.txt",
    isSpecialUI: "dual-markdown",
    faqs: [{ q: "Does this support GitHub Flavored Markdown (GFM)?", a: "Yes, tables, code fences, and strikethrough are supported." }],
    howTo: [
      { step: "1", title: "Paste Markdown or HTML", desc: "Type or paste your text into the editor." },
      { step: "2", title: "View Live Output", desc: "Output updates in real time." },
      { step: "3", title: "Copy or Export", desc: "Copy code or save as a file." }
    ]
  },
  {
    id: "case-converter",
    name: "Text Case Converter",
    shortTitle: "Case Converter",
    badge: "Text Tool",
    category: "text",
    icon: "type",
    accentColor: "text",
    desc: "Convert text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.",
    metaTitle: "Text Case Converter - UPPERCASE, lowercase, Title Case, camelCase",
    metaDesc: "Change text case online. Transform text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case.",
    isSpecialUI: "case-converter",
    faqs: [{ q: "What cases are supported?", a: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and aLtErNaTiNg case." }],
    howTo: [
      { step: "1", title: "Input Text", desc: "Paste your text into the box." },
      { step: "2", title: "Choose Case", desc: "Click any case button to transform." },
      { step: "3", title: "Copy", desc: "Copy formatted text to clipboard." }
    ]
  },
  {
    id: "text-to-speech",
    name: "Text to Speech (TTS) Reader",
    shortTitle: "Text to Speech",
    badge: "Voice & Audio",
    category: "text",
    icon: "volume-2",
    accentColor: "text",
    desc: "Listen to any text read aloud with natural browser voices, customizable pitch, speed, and volume controls.",
    metaTitle: "Text to Speech (TTS) Online - Natural Voice Reader",
    metaDesc: "Convert written text into spoken audio with customizable voices, playback speed, and pitch.",
    isSpecialUI: "tts",
    faqs: [{ q: "Are multiple voices available?", a: "Yes, you can choose from all installed system and browser voices in English and other languages." }],
    howTo: [
      { step: "1", title: "Type or Paste Text", desc: "Enter text you want read aloud." },
      { step: "2", title: "Tune Voice", desc: "Adjust speed and voice pitch." },
      { step: "3", title: "Listen", desc: "Click Play to hear speech." }
    ]
  },
  {
    id: "base64-converter",
    name: "Base64 Encoder & Decoder",
    shortTitle: "Base64 Converter",
    badge: "Developer Tool",
    category: "text",
    icon: "binary",
    accentColor: "text",
    desc: "Encode strings and files into Base64 format or decode Base64 strings back to readable text and binary.",
    metaTitle: "Base64 Encoder & Decoder - Convert Strings & Files Online",
    metaDesc: "Encode text to Base64 and decode Base64 strings to UTF-8 text online with live dual-pane editor.",
    isSpecialUI: "base64",
    faqs: [{ q: "Can I decode Base64 with UTF-8 characters?", a: "Yes, full Unicode/UTF-8 multi-byte characters are supported." }],
    howTo: [
      { step: "1", title: "Enter Data", desc: "Paste plain text or Base64 code." },
      { step: "2", title: "Select Action", desc: "Click Encode or Decode." },
      { step: "3", title: "Copy Result", desc: "Copy converted output." }
    ]
  },
  {
    id: "url-converter",
    name: "URL Encoder & Decoder",
    shortTitle: "URL Encoder",
    badge: "Web Tool",
    category: "text",
    icon: "link",
    accentColor: "text",
    desc: "Encode URI components and query parameters safely or decode percent-encoded URLs back to clean strings.",
    metaTitle: "URL Encoder & Decoder - Percent Encoding Online Free",
    metaDesc: "Encode and decode URLs and query parameters online with instant copy-to-clipboard.",
    isSpecialUI: "url-coder",
    faqs: [{ q: "What does URL encoding do?", a: "It converts spaces and special characters into percent-encoded entities like %20." }],
    howTo: [
      { step: "1", title: "Paste URL", desc: "Input your web address or query string." },
      { step: "2", title: "Encode / Decode", desc: "Click Encode or Decode button." },
      { step: "3", title: "Copy Result", desc: "Use the sanitized URL safely." }
    ]
  },

  // ==================== 5. UNIT & MEASUREMENT CONVERTERS ====================
  {
    id: "currency-converter",
    name: "Live Currency Converter",
    shortTitle: "Currency Converter",
    badge: "Live Rates",
    category: "unit",
    icon: "dollar-sign",
    accentColor: "unit",
    desc: "Convert between 150+ world currencies (USD, EUR, GBP, PKR, INR, AED, SAR, CAD, AUD) with real-time exchange rates.",
    metaTitle: "Currency Converter - Real-Time Live Exchange Rates Online",
    metaDesc: "Free real-time currency converter for USD, EUR, GBP, PKR, INR, AED, SAR, CAD, AUD with live forex rates.",
    isSpecialUI: "currency",
    faqs: [{ q: "How frequently are exchange rates updated?", a: "Rates are pulled in real time via live open financial APIs." }],
    howTo: [
      { step: "1", title: "Enter Amount", desc: "Input numerical value to convert." },
      { step: "2", title: "Select Currencies", desc: "Choose From and To currency codes." },
      { step: "3", title: "View Result", desc: "See converted rate instantly." }
    ]
  },
  {
    id: "unit-converter",
    name: "Length, Weight & Temperature Converter",
    shortTitle: "Unit Converter",
    badge: "Measurement",
    category: "unit",
    icon: "scale",
    accentColor: "unit",
    desc: "Universal converter for metric & imperial measurements: Meters, Feet, Inches, Kilograms, Pounds, Celsius, Fahrenheit, and Kelvin.",
    metaTitle: "Unit Converter - Length, Weight, Temperature Metric & Imperial",
    metaDesc: "Convert units of length (m, ft, in, km, mi), weight (kg, lbs, oz, g), and temperature (C, F, K) online.",
    isSpecialUI: "units-multi",
    faqs: [{ q: "Does this support metric and imperial?", a: "Yes, convert seamlessly between meters, feet, kg, pounds, Celsius, Fahrenheit, and more." }],
    howTo: [
      { step: "1", title: "Select Category", desc: "Choose Length, Weight, or Temperature." },
      { step: "2", title: "Enter Value", desc: "Type number and pick units." },
      { step: "3", title: "Instant Conversion", desc: "Result updates immediately." }
    ]
  },
  {
    id: "timezone-converter",
    name: "World Time Zone Converter",
    shortTitle: "Time Zone Converter",
    badge: "Global Time",
    category: "unit",
    icon: "clock",
    accentColor: "unit",
    desc: "Compare time differences and convert meeting times across UTC, EST, PST, GMT, London, Dubai, Karachi, and Tokyo.",
    metaTitle: "Time Zone Converter - Compare World Times & Meeting Planner",
    metaDesc: "Convert time across world time zones (UTC, GMT, EST, PST, PKT, IST, JST) with live clock comparison.",
    isSpecialUI: "timezone",
    faqs: [{ q: "Does this account for Daylight Saving Time (DST)?", a: "Yes, browser internationalization automatically handles DST offsets." }],
    howTo: [
      { step: "1", title: "Select Date & Time", desc: "Choose your base time." },
      { step: "2", title: "Pick Time Zones", desc: "Select source and destination cities." },
      { step: "3", title: "Compare Time", desc: "View converted time and date." }
    ]
  },
  {
    id: "data-storage-converter",
    name: "Data Storage (MB ↔ GB ↔ TB) Converter",
    shortTitle: "Data Storage",
    badge: "Byte Calculator",
    category: "unit",
    icon: "hard-drive",
    accentColor: "unit",
    desc: "Convert digital file and memory sizes between Bits, Bytes, KB, MB, GB, TB, and PB in base-2 (1024) or base-10.",
    metaTitle: "Data Storage Converter - Convert Bytes, KB, MB, GB, TB, PB Online",
    metaDesc: "Convert data storage units between Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes online.",
    isSpecialUI: "data-storage",
    faqs: [{ q: "How many Megabytes are in a Gigabyte?", a: "In standard binary computation, 1 GB = 1,024 MB." }],
    howTo: [
      { step: "1", title: "Enter Size", desc: "Type number." },
      { step: "2", title: "Choose Unit", desc: "Select MB, GB, TB, etc." },
      { step: "3", title: "View All Units", desc: "See equivalent sizes in all units." }
    ]
  },

  // ==================== 6. MEDIA & DESIGN CONVERTERS ====================
  {
    id: "color-converter",
    name: "Color Format (HEX ↔ RGB ↔ CMYK ↔ HSL) Converter",
    shortTitle: "Color Converter",
    badge: "Design Tool",
    category: "design",
    icon: "palette",
    accentColor: "design",
    desc: "Convert colors between HEX, RGB, CMYK, and HSL with an interactive live color picker, contrast preview, and copy buttons.",
    metaTitle: "Color Converter - HEX, RGB, CMYK, HSL Color Code Converter",
    metaDesc: "Convert color codes between HEX, RGB, CMYK, and HSL online with interactive color palette and preview.",
    isSpecialUI: "color-picker",
    faqs: [{ q: "Can I convert print CMYK to digital HEX?", a: "Yes, preview both digital RGB/HEX and 4-color print CMYK values." }],
    howTo: [
      { step: "1", title: "Pick or Enter Color", desc: "Use the visual picker or type a HEX/RGB code." },
      { step: "2", title: "View Equivalents", desc: "See HEX, RGB, CMYK, and HSL calculated." },
      { step: "3", title: "Copy", desc: "Copy color code with one click." }
    ]
  },
  {
    id: "font-converter",
    name: "Font (TTF ↔ WOFF) Web Font Generator",
    shortTitle: "Font Converter",
    badge: "Web Typography",
    category: "design",
    icon: "type",
    accentColor: "design",
    desc: "Convert TTF/OTF font files into web-optimized WOFF/WOFF2 formats with auto-generated CSS @font-face code.",
    metaTitle: "Font Converter - TTF to WOFF & WOFF2 Web Font Converter",
    metaDesc: "Convert desktop TTF fonts to web-ready WOFF and WOFF2 formats with CSS @font-face code generator.",
    acceptedTypes: ".ttf,.otf,.woff,.woff2",
    defaultTarget: "woff",
    availableTargets: ["woff", "woff2"],
    isSpecialUI: "font-tool",
    faqs: [{ q: "Why use WOFF for websites?", a: "WOFF fonts compress typography files by up to 40% for faster page loads." }],
    howTo: [
      { step: "1", title: "Upload Font", desc: "Select .ttf or .otf file." },
      { step: "2", title: "Convert", desc: "Package into compressed WOFF." },
      { step: "3", title: "Copy CSS", desc: "Download font & copy @font-face CSS." }
    ]
  },
  {
    id: "qr-generator",
    name: "QR Code Generator & Scanner",
    shortTitle: "QR Code Tool",
    badge: "Utility",
    category: "design",
    icon: "qr-code",
    accentColor: "design",
    desc: "Generate high-resolution custom QR codes for URLs, WiFi, contact cards, or scan QR codes directly from images.",
    metaTitle: "QR Code Generator & Reader - Create & Scan QR Codes Online",
    metaDesc: "Create custom high-res QR codes for links, text, and WiFi, or scan QR code images online for free.",
    isSpecialUI: "qr-code-suite",
    faqs: [{ q: "Can I download QR codes in high quality?", a: "Yes, export as high-resolution PNG or SVG for print." }],
    howTo: [
      { step: "1", title: "Enter Content", desc: "Type URL or text." },
      { step: "2", title: "Customize", desc: "Set size and colors." },
      { step: "3", title: "Download or Scan", desc: "Download QR PNG or scan an existing image." }
    ]
  },

  // ==================== 7. EVERYDAY UTILITIES & CALCULATORS ====================
  {
    id: "word-counter",
    name: "Word & Character Count Analyzer",
    shortTitle: "Word Counter",
    badge: "Writing Tool",
    category: "calc",
    icon: "file-text",
    accentColor: "calc",
    desc: "Real-time analytics for words, characters (with/without spaces), sentences, paragraphs, reading time, speaking time, and top keywords.",
    metaTitle: "Word Counter - Character, Sentence & Reading Time Counter",
    metaDesc: "Count words, characters, sentences, paragraphs, reading time, and keyword density online in real time.",
    isSpecialUI: "word-counter",
    faqs: [{ q: "Does this calculate estimated reading time?", a: "Yes, based on average reading speed of 200 words per minute." }],
    howTo: [
      { step: "1", title: "Type or Paste Essay/Article", desc: "Input text." },
      { step: "2", title: "Live Metrics", desc: "See words, characters, and reading time calculate instantly." }
    ]
  },
  {
    id: "age-calculator",
    name: "Exact Age & Birthday Calculator",
    shortTitle: "Age Calculator",
    badge: "High Search Volume",
    category: "calc",
    icon: "calendar",
    accentColor: "calc",
    desc: "Calculate your exact age in years, months, days, total weeks, hours, and seconds, plus a live countdown to your next birthday.",
    metaTitle: "Age Calculator - Calculate Exact Age in Years, Months, Days & Hours",
    metaDesc: "Calculate your precise age from date of birth in years, months, days, total weeks, hours, and days until next birthday.",
    isSpecialUI: "age-calc",
    faqs: [{ q: "Can I calculate age on a specific future or past date?", a: "Yes, choose any target date to calculate age at that moment." }],
    howTo: [
      { step: "1", title: "Select Date of Birth", desc: "Choose year, month, and day." },
      { step: "2", title: "Calculate", desc: "View exact age breakdown and birthday countdown." }
    ]
  },
  {
    id: "date-calculator",
    name: "Date Difference & Duration Calculator",
    shortTitle: "Date Difference",
    badge: "Calendar Tool",
    category: "calc",
    icon: "calendar-days",
    accentColor: "calc",
    desc: "Calculate exact duration, total days, weeks, and business days between any two calendar dates.",
    metaTitle: "Date Difference Calculator - Days Between Two Dates Online",
    metaDesc: "Calculate total number of days, weeks, and months between two dates with working day calculation.",
    isSpecialUI: "date-diff",
    faqs: [{ q: "Can this calculate days between two dates in different years?", a: "Yes, calculate across any range of calendar dates." }],
    howTo: [
      { step: "1", title: "Select Start & End Dates", desc: "Pick two dates." },
      { step: "2", title: "Calculate", desc: "See total days, weeks, and duration." }
    ]
  },

  // ==================== 8. DATA CONVERTERS ====================
  {
    id: "csv-excel",
    name: "CSV ↔ Excel (XLSX) Converter",
    shortTitle: "CSV ↔ Excel",
    badge: "Spreadsheet",
    category: "data",
    icon: "table",
    accentColor: "data",
    desc: "Convert CSV files into formatted Microsoft Excel (.xlsx) workbooks or export multi-sheet Excel files into clean CSV data.",
    metaTitle: "CSV to Excel Converter - Convert CSV to XLSX and Excel to CSV Online",
    metaDesc: "Convert CSV to Excel (.xlsx) and XLSX to CSV online for free. Auto delimiter detection, multi-sheet support.",
    acceptedTypes: ".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    defaultTarget: "xlsx",
    availableTargets: ["xlsx", "csv"],
    hasQualityControl: false,
    faqs: [{ q: "Does this handle comma and tab delimiters?", a: "Yes, auto-detects commas, tabs, and semicolons." }],
    howTo: [
      { step: "1", title: "Upload CSV or Excel", desc: "Select file." },
      { step: "2", title: "Convert", desc: "Process sheet data." },
      { step: "3", title: "Download", desc: "Save converted spreadsheet." }
    ]
  },
  {
    id: "csv-json",
    name: "CSV ↔ JSON Converter",
    shortTitle: "CSV ↔ JSON",
    badge: "Developer Tool",
    category: "data",
    icon: "code",
    accentColor: "data",
    desc: "Convert tabular CSV datasets into structured JSON arrays of objects or flatten complex JSON structures into clean CSV records.",
    metaTitle: "CSV to JSON Converter - Convert CSV to JSON and JSON to CSV Online",
    metaDesc: "Convert CSV data to structured JSON and JSON to CSV online. Dual-pane live editor, syntax highlighting, copy-to-clipboard.",
    acceptedTypes: ".csv,.json,text/csv,application/json",
    defaultTarget: "json",
    availableTargets: ["json", "csv"],
    hasQualityControl: false,
    faqs: [{ q: "Does this convert headers to JSON keys?", a: "Yes, top row becomes object properties." }],
    howTo: [
      { step: "1", title: "Paste or Upload", desc: "Input CSV or JSON." },
      { step: "2", title: "Convert Instantly", desc: "Live output updates." },
      { step: "3", title: "Copy or Download", desc: "Save converted file." }
    ]
  },
  {
    id: "json-xml",
    name: "JSON ↔ XML Converter",
    shortTitle: "JSON ↔ XML",
    badge: "API & Data",
    category: "data",
    icon: "file-code-2",
    accentColor: "data",
    desc: "Convert JSON payloads into formatted XML with custom root tags or parse XML feeds into clean, readable JSON objects.",
    metaTitle: "JSON to XML Converter - Convert JSON to XML and XML to JSON Online",
    metaDesc: "Convert JSON to XML and XML to JSON online for free. Customizable root elements, pretty printing, syntax highlighting.",
    acceptedTypes: ".json,.xml,application/json,application/xml,text/xml",
    defaultTarget: "xml",
    availableTargets: ["xml", "json"],
    hasQualityControl: false,
    faqs: [{ q: "Can I customize the XML root tag?", a: "Yes, define custom wrapper elements like <root> or <items>." }],
    howTo: [
      { step: "1", title: "Input Code", desc: "Paste JSON or XML." },
      { step: "2", title: "Transform", desc: "Engine formats structure." },
      { step: "3", title: "Export", desc: "Copy or download formatted result." }
    ]
  }
];

window.TOOLS_DATA = TOOLS_DATA;
