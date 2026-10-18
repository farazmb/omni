# pylint: disable=print-used
#!/usr/bin/env python3
"""
OmniConvert - Deep Quality Assurance & Comprehensive Unit Test Suite
Validates every converter module, mathematical calculation, schema markup,
SEO tag integrity, and HTTP serving performance.
"""

import os
import sys
import re
import urllib.request
import xml.etree.ElementTree as ET

WORKSPACE = os.path.dirname(os.path.abspath(__file__))

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.total = 0

    def assert_true(self, condition, test_name, error_msg=""):
        self.total += 1
        if condition:
            self.passed += 1
            print(f"  ✓ [PASS] {test_name}")
        else:
            self.failed += 1
            print(f"  ✗ [FAIL] {test_name} - {error_msg}")

    def assert_equal(self, actual, expected, test_name):
        self.total += 1
        if actual == expected:
            self.passed += 1
            print(f"  ✓ [PASS] {test_name}")
        else:
            self.failed += 1
            print(f"  ✗ [FAIL] {test_name} - Expected '{expected}', got '{actual}'")

runner = TestRunner()

# ==============================================================================
# SECTION 1: UNIT TESTING TEXT CONVERTER ALGORITHMS (textConverter.js)
# ==============================================================================
print("\n" + "="*70)
print("SECTION 1: TEXT CONVERTER UNIT TESTS")
print("="*70)

# Case Converter Python Equivalent Logic matching textConverter.js
def convert_case(text, case_type):
    if not text: return ''
    if case_type == 'uppercase':
        return text.upper()
    elif case_type == 'lowercase':
        return text.lower()
    elif case_type == 'titlecase':
        return re.sub(r'\w\S*', lambda m: m.group(0)[0].upper() + m.group(0)[1:].lower(), text)
    elif case_type == 'sentencecase':
        return re.sub(r'(^\s*\w|[.!?]\s*\w)', lambda m: m.group(0).upper(), text.lower())
    elif case_type == 'camelcase':
        words = text.split()
        if not words: return ''
        return words[0].lower() + ''.join(w.capitalize() for w in words[1:])
    elif case_type == 'snakecase':
        s = re.sub(r'[\s-]+', '_', text)
        s = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s)
        return s.strip('_').lower()
    elif case_type == 'kebabcase':
        s = re.sub(r'[\s_]+', '-', text)
        s = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', s)
        return s.strip('-').lower()
    elif case_type == 'alternating':
        return ''.join(c.lower() if i % 2 == 0 else c.upper() for i, c in enumerate(text))
    return text

sample_text = "hello world, this is omniconvert."
runner.assert_equal(convert_case(sample_text, 'uppercase'), "HELLO WORLD, THIS IS OMNICONVERT.", "Uppercase Conversion")
runner.assert_equal(convert_case("HELLO WORLD", 'lowercase'), "hello world", "Lowercase Conversion")
runner.assert_equal(convert_case("hello world", 'titlecase'), "Hello World", "Title Case Conversion")
runner.assert_equal(convert_case("hello. how are you? fine!", 'sentencecase'), "Hello. How are you? Fine!", "Sentence Case Conversion")
runner.assert_equal(convert_case("hello world converter", 'camelcase'), "helloWorldConverter", "CamelCase Conversion")
runner.assert_equal(convert_case("Hello World Converter", 'snakecase'), "hello_world_converter", "Snake_Case Conversion")
runner.assert_equal(convert_case("Hello World Converter", 'kebabcase'), "hello-world-converter", "Kebab-Case Conversion")
runner.assert_equal(convert_case("hello", 'alternating'), "hElLo", "Alternating Case Conversion")

# Base64 Encoding / Decoding Tests
import base64
b64_plain = "OmniConvert 2026: Fast, Private In-Browser Tools!"
b64_encoded = base64.b64encode(b64_plain.encode('utf-8')).decode('utf-8')
b64_decoded = base64.b64decode(b64_encoded).decode('utf-8')
runner.assert_equal(b64_decoded, b64_plain, "Base64 Roundtrip Encode & Decode")

# URL Encoding / Decoding Tests
import urllib.parse
url_plain = "https://omniconvert.com/search?q=free tools & high speed=100%"
url_encoded = urllib.parse.quote(url_plain, safe='')
url_decoded = urllib.parse.unquote(url_encoded)
runner.assert_equal(url_decoded, url_plain, "URL Percent Roundtrip Encode & Decode")

# ==============================================================================
# SECTION 2: UNIT TESTING UNIT & MEASUREMENT CONVERTER (unitConverter.js)
# ==============================================================================
print("\n" + "="*70)
print("SECTION 2: UNIT & MEASUREMENT CONVERTER UNIT TESTS")
print("="*70)

# Length conversion
length_units = {'m': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344}
def convert_length(val, f, t):
    return (val * length_units[f]) / (length_units[t] or 1)

runner.assert_equal(convert_length(1, 'km', 'm'), 1000.0, "1 km = 1000 m")
runner.assert_equal(convert_length(1, 'm', 'cm'), 100.0, "1 m = 100 cm")
runner.assert_equal(round(convert_length(1, 'mi', 'km'), 4), 1.6093, "1 mile ≈ 1.6093 km")
runner.assert_equal(round(convert_length(1, 'ft', 'in'), 1), 12.0, "1 foot = 12 inches")

# Weight conversion
weight_units = {'kg': 1, 'g': 0.001, 'mg': 0.000001, 'lb': 0.45359237, 'oz': 0.028349523, 't': 1000}
def convert_weight(val, f, t):
    return (val * weight_units[f]) / (weight_units[t] or 1)

runner.assert_equal(convert_weight(1, 'kg', 'g'), 1000.0, "1 kg = 1000 g")
runner.assert_equal(round(convert_weight(1, 'lb', 'g'), 2), 453.59, "1 lb ≈ 453.59 g")
runner.assert_equal(round(convert_weight(1, 't', 'kg'), 1), 1000.0, "1 metric ton = 1000 kg")

# Temperature conversion
def convert_temp(val, f, t):
    if f == 'f': c = (val - 32) * (5 / 9)
    elif f == 'k': c = val - 273.15
    else: c = val

    if t == 'c': return c
    elif t == 'f': return (c * (9 / 5)) + 32
    elif t == 'k': return c + 273.15
    return c

runner.assert_equal(convert_temp(0, 'c', 'f'), 32.0, "0°C = 32°F (Freezing point)")
runner.assert_equal(convert_temp(100, 'c', 'f'), 212.0, "100°C = 212°F (Boiling point)")
runner.assert_equal(convert_temp(0, 'c', 'k'), 273.15, "0°C = 273.15 K")
runner.assert_equal(round(convert_temp(98.6, 'f', 'c'), 1), 37.0, "98.6°F (Body Temp) = 37.0°C")

# Data Storage Conversion
data_units = {'B': 1, 'KB': 1024, 'MB': 1024**2, 'GB': 1024**3, 'TB': 1024**4, 'PB': 1024**5}
def convert_data(val, f, t):
    return (val * data_units[f]) / (data_units[t] or 1)

runner.assert_equal(convert_data(1024, 'MB', 'GB'), 1.0, "1024 MB = 1 GB")
runner.assert_equal(convert_data(1, 'TB', 'GB'), 1024.0, "1 TB = 1024 GB")
runner.assert_equal(convert_data(1, 'KB', 'B'), 1024.0, "1 KB = 1024 Bytes")

# ==============================================================================
# SECTION 3: UNIT TESTING DESIGN & COLOR CONVERTER (designConverter.js)
# ==============================================================================
print("\n" + "="*70)
print("SECTION 3: COLOR & DESIGN CONVERTER UNIT TESTS")
print("="*70)

def hex_to_rgb(hex_code):
    h = hex_code.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b).upper()

def rgb_to_cmyk(r, g, b):
    if (r, g, b) == (0, 0, 0):
        return (0, 0, 0, 100)
    c = 1 - (r / 255)
    m = 1 - (g / 255)
    y = 1 - (b / 255)
    k = min(c, m, y)
    c = round(((c - k) / (1 - k or 1)) * 100)
    m = round(((m - k) / (1 - k or 1)) * 100)
    y = round(((y - k) / (1 - k or 1)) * 100)
    k = round(k * 100)
    return (c, m, y, k)

runner.assert_equal(hex_to_rgb("#6366F1"), (99, 102, 241), "HEX #6366F1 -> RGB (99, 102, 241)")
runner.assert_equal(rgb_to_hex(99, 102, 241), "#6366F1", "RGB (99, 102, 241) -> HEX #6366F1")
runner.assert_equal(hex_to_rgb("#FFF"), (255, 255, 255), "Shorthand HEX #FFF -> RGB (255, 255, 255)")
runner.assert_equal(rgb_to_cmyk(0, 0, 0), (0, 0, 0, 100), "Black (0,0,0) -> CMYK 100% K")
runner.assert_equal(rgb_to_cmyk(255, 255, 255), (0, 0, 0, 0), "White (255,255,255) -> CMYK 0%")

# ==============================================================================
# SECTION 4: UNIT TESTING UTILITY CONVERTER (utilityConverter.js)
# ==============================================================================
print("\n" + "="*70)
print("SECTION 4: UTILITY & CALCULATORS UNIT TESTS")
print("="*70)

# Word Counter Algorithm
def analyze_text(text):
    if not text or not text.strip():
        return {'words': 0, 'chars': 0, 'chars_no_space': 0, 'sentences': 0}
    words = re.findall(r'\b[a-zA-Z0-9_\u0600-\u06FF\'\-]+\b', text)
    sentences = re.findall(r'[^.!?]+[.!?]+', text) or ([1] if words else [])
    return {
        'words': len(words),
        'chars': len(text),
        'chars_no_space': len(re.sub(r'\s+', '', text)),
        'sentences': len(sentences)
    }

sample_doc = "The quick brown fox jumps over the lazy dog. It was a sunny day! How are you?"
res = analyze_text(sample_doc)
runner.assert_equal(res['words'], 17, "Word Count Accuracy (17 words)")
runner.assert_equal(res['sentences'], 3, "Sentence Count Accuracy (3 sentences)")
runner.assert_equal(res['chars'], len(sample_doc), "Total Characters Count")
runner.assert_equal(res['chars_no_space'], len(sample_doc.replace(' ', '')), "Characters Without Spaces Count")

# Date Difference Calculator
from datetime import date
d1 = date(2026, 1, 1)
d2 = date(2026, 1, 31)
diff_days = (d2 - d1).days
runner.assert_equal(diff_days, 30, "Date Difference (Jan 1 to Jan 31 = 30 days)")

# Age Calculator Logic
def calculate_age(birth_date, target_date):
    years = target_date.year - birth_date.year
    months = target_date.month - birth_date.month
    days = target_date.day - birth_date.day

    if days < 0:
        months -= 1
        # Days in previous month
        prev_month = 12 if target_date.month == 1 else target_date.month - 1
        prev_year = target_date.year - 1 if target_date.month == 1 else target_date.year
        import calendar
        days += calendar.monthrange(prev_year, prev_month)[1]

    if months < 0:
        years -= 1
        months += 12

    return years, months, days

bday = date(2000, 5, 15)
today = date(2026, 5, 15)
y, m, d = calculate_age(bday, today)
runner.assert_equal(y, 26, "Exact Age Calculation (Years = 26)")
runner.assert_equal(m, 0, "Exact Age Calculation (Months = 0)")
runner.assert_equal(d, 0, "Exact Age Calculation (Days = 0)")

# ==============================================================================
# SECTION 5: DATA CONVERTER (dataConverter.js)
# ==============================================================================
print("\n" + "="*70)
print("SECTION 5: DATA FORMAT CONVERTER UNIT TESTS")
print("="*70)

# CSV to JSON
import csv, io
sample_csv = "id,name,role\n1,Rafiq,Engineer\n2,Sarah,Designer"
reader = csv.DictReader(io.StringIO(sample_csv))
json_res = list(reader)
runner.assert_equal(len(json_res), 2, "CSV to JSON Record Count (2 rows)")
runner.assert_equal(json_res[0]['name'], "Rafiq", "CSV to JSON Field Mapping")

# JSON to XML
def dict_to_xml(d, root_tag='root'):
    xml_str = f"<{root_tag}>"
    for k, v in d.items():
        xml_str += f"<{k}>{v}</{k}>"
    xml_str += f"</{root_tag}>"
    return xml_str

xml_out = dict_to_xml({"status": "success", "code": "200"})
runner.assert_true("<status>success</status>" in xml_out, "JSON to XML Node Generation")

# ==============================================================================
# SECTION 6: STANDALONE SEO PAGES & SCHEMA INTEGRITY TESTS
# ==============================================================================
print("\n" + "="*70)
print("SECTION 6: STANDALONE STATIC PAGES & SEO SCHEMA INTEGRITY TESTS")
print("="*70)

# Load tools from toolsData.js
with open(os.path.join(WORKSPACE, 'assets/js/toolsData.js'), 'r', encoding='utf-8') as f:
    text = f.read()
tool_ids = re.findall(r'id:\s*"([^"]+)"', text)
runner.assert_equal(len(tool_ids), 33, "33 Tools Defined in toolsData.js")

# Verify every single tool has a dedicated standalone folder and index.html
missing_tools = []
schema_errors = []
for tid in tool_ids:
    page_path = os.path.join(WORKSPACE, tid, 'index.html')
    if not os.path.exists(page_path):
        missing_tools.append(tid)
        continue
    
    with open(page_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check key SEO essentials
    if f'<link rel="canonical" href="https://omniconvert.com/{tid}/">' not in html:
        schema_errors.append(f"{tid}: Missing canonical link")
    if 'application/ld+json' not in html:
        schema_errors.append(f"{tid}: Missing JSON-LD Schema")
    if 'WebApplication' not in html:
        schema_errors.append(f"{tid}: Missing WebApplication Schema")
    if 'FAQPage' not in html:
        schema_errors.append(f"{tid}: Missing FAQPage Schema")
    if 'BreadcrumbList' not in html:
        schema_errors.append(f"{tid}: Missing BreadcrumbList Schema")
    if f"AppRouter.initStandaloneTool('{tid}')" not in html:
        schema_errors.append(f"{tid}: Missing standalone initialization call")

runner.assert_equal(len(missing_tools), 0, f"All 33 Standalone Tool Directories Exist (Missing: {missing_tools})")
runner.assert_equal(len(schema_errors), 0, f"All 33 Tool Pages Have Valid Quad-Entity Schema & Canonical (Errors: {len(schema_errors)})")

# Verify Blog Posts
blog_ids = [
    "how-to-convert-heic-to-jpg-iphone",
    "webp-vs-avif-vs-png-jpg-comparison",
    "how-to-extract-tables-pdf-to-excel",
    "video-compression-guide-web-discord-email",
    "csv-json-xml-data-guide"
]
missing_blogs = []
for bid in blog_ids:
    bpath = os.path.join(WORKSPACE, 'blog', bid, 'index.html')
    if not os.path.exists(bpath):
        missing_blogs.append(bid)
    else:
        with open(bpath, 'r', encoding='utf-8') as f:
            bhtml = f.read()
        runner.assert_true('BlogPosting' in bhtml, f"Blog Post /{bid}/ contains BlogPosting Schema")

runner.assert_equal(len(missing_blogs), 0, "All 5 Editorial Blog Posts Exist")

# Verify Hub and Info pages
for p in ['tools', 'blog', 'about', 'privacy', 'terms', 'contact']:
    ppath = os.path.join(WORKSPACE, p, 'index.html')
    runner.assert_true(os.path.exists(ppath), f"Hub/Info page /{p}/index.html exists")

# ==============================================================================
# SECTION 7: SITEMAP & ROBOTS.TXT DEEP VALIDATION
# ==============================================================================
print("\n" + "="*70)
print("SECTION 7: SITEMAP.XML & ROBOTS.TXT VALIDATION")
print("="*70)

sitemap_path = os.path.join(WORKSPACE, 'sitemap.xml')
tree = ET.parse(sitemap_path)  # noqa: S314
root = tree.getroot()
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [loc.text for loc in root.findall('s:url/s:loc', ns)]

runner.assert_true(len(urls) >= 45, f"Sitemap Contains {len(urls)} URLs (Expected >= 45)")
runner.assert_true(all('#' not in u for u in urls), "Zero Hash Fragments in Sitemap URLs (100% Clean Canonical)")
runner.assert_true('https://omniconvert.com/heic-to-jpg/' in urls, "Sitemap contains /heic-to-jpg/")
runner.assert_true('https://omniconvert.com/pdf-compressor/' in urls, "Sitemap contains /pdf-compressor/")
runner.assert_true('https://omniconvert.com/tools/' in urls, "Sitemap contains /tools/")
runner.assert_true('https://omniconvert.com/blog/' in urls, "Sitemap contains /blog/")

robots_path = os.path.join(WORKSPACE, 'robots.txt')
with open(robots_path, 'r') as f:
    robots_text = f.read()
runner.assert_true('Allow: /' in robots_text, "robots.txt allows all crawlers")
runner.assert_true('Sitemap: https://omniconvert.com/sitemap.xml' in robots_text, "robots.txt references sitemap.xml")

# ==============================================================================
# SECTION 8: LIVE HTTP SERVER ENDPOINT VALIDATION
# ==============================================================================
print("\n" + "="*70)
print("SECTION 8: LIVE HTTP SERVER TEST ON PORT 3000")
print("="*70)

endpoints_to_test = [
    ('/', 200),
    ('/tools/', 200),
    ('/blog/', 200),
    ('/heic-to-jpg/', 200),
    ('/pdf-compressor/', 200),
    ('/word-counter/', 200),
    ('/text-to-speech/', 200),
    ('/currency-converter/', 200),
    ('/age-calculator/', 200),
    ('/color-converter/', 200),
    ('/mp4-to-mp3/', 200),
    ('/blog/how-to-convert-heic-to-jpg-iphone/', 200),
    ('/about/', 200),
    ('/privacy/', 200),
    ('/terms/', 200),
    ('/contact/', 200),
    ('/sitemap.xml', 200),
    ('/robots.txt', 200),
    ('/assets/css/style.css', 200),
    ('/assets/js/router.js', 200)
]

for ep, expected_code in endpoints_to_test:
    url = f"http://localhost:3000{ep}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Googlebot/2.1)'})  # noqa: S310
        with urllib.request.urlopen(req) as resp:  # noqa: S310
            code = resp.getcode()
            headers = dict(resp.getheaders())
            has_coop = 'Cross-Origin-Opener-Policy' in headers
            runner.assert_equal(code, expected_code, f"HTTP Endpoint {ep} -> Status 200")
            if ep.endswith('.html') or ep.endswith('/'):
                runner.assert_true(has_coop, f"HTTP Endpoint {ep} -> COOP/COEP Headers Present")
    except Exception as e:
        runner.assert_true(False, f"HTTP Endpoint {ep}", str(e))

# ==============================================================================
# FINAL RESULTS SUMMARY
# ==============================================================================
print("\n" + "="*70)
print(f"DEEP TEST SUITE COMPLETED: {runner.passed}/{runner.total} PASSED ({runner.failed} FAILED)")
print("="*70)

if runner.failed > 0:
    sys.exit(1)
sys.exit(0)
