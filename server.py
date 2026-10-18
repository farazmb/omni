# pylint: disable=print-used
#!/usr/bin/env python3
"""
OmniConvert - Local Development Server
Provides HTTP serving with proper MIME types, CORS headers,
and COOP/COEP isolation headers for WebAssembly support.
"""

import http.server
import socketserver
import os
import sys

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and isolation for WebAssembly SharedArrayBuffer
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        return super().end_headers()

    def guess_type(self, path):
        if path.endswith('.wasm'):
            return 'application/wasm'
        if path.endswith('.mjs') or path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        if path.endswith('.css'):
            return 'text/css'
        return super().guess_type(path)

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print("============================================================")
        print(f"🚀 OmniConvert Server is running at: http://localhost:{PORT}")
        print(f"📁 Serving directory: {os.getcwd()}")
        print("🔒 COOP/COEP Headers enabled for WebAssembly performance")
        print("============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == '__main__':
    run_server()
