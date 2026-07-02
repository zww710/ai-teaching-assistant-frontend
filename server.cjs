const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BACKEND = 'http://localhost:8001';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const DIST_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

function serveStatic(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function proxyRequest(req, res) {
  const proxyUrl = BACKEND + req.url;
  console.log('Proxying:', req.method, req.url);
  const proxyReq = http.request(proxyUrl, {
    method: req.method,
    headers: { ...req.headers, host: 'localhost:8001' }
  }, proxyRes => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', e => {
    console.error('Proxy error:', e.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  });
  // Handle POST body
  if (req.method === 'POST' || req.method === 'PUT') {
    req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Proxy API requests to backend
  if (pathname.startsWith('/api/') || pathname === '/api/auth/login' || pathname === '/api/auth/register' || pathname === '/api/auth/me') {
    proxyRequest(req, res);
    return;
  }

  // Serve dist files first (for built assets)
  let filePath;
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(DIST_DIR, 'index.html');
  } else if (pathname === '/app.html' || pathname === '/app.html#/') {
    filePath = path.join(DIST_DIR, 'app.html');
  } else if (pathname.startsWith('/assets/')) {
    filePath = path.join(DIST_DIR, pathname);
  } else if (pathname.startsWith('/src/')) {
    filePath = path.join(SRC_DIR, pathname);
  } else {
    filePath = path.join(DIST_DIR, pathname);
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveStatic(res, filePath, contentType);
  } else {
    // SPA fallback - serve index.html for hash routes
    if (pathname.startsWith('/assets/') || pathname.startsWith('/src/') || ext) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      serveStatic(res, path.join(DIST_DIR, 'index.html'), 'text/html; charset=utf-8');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
  console.log(`Proxying API requests to ${BACKEND}`);
});
