import app from '../backend/src/server.js';

export default function handler(req, res) {
  const rawPath = req.query.path || '';
  if (rawPath) {
    const subPath = Array.isArray(rawPath) ? rawPath.join('/') : rawPath;
    const cleanPath = String(subPath).replace(/\.js$/i, '');
    const cleanUrl = (`/api/${cleanPath}`).replace(/\/+/g, '/');
    req.url = cleanUrl;
    req.originalUrl = cleanUrl;
  } else if (req.url) {
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
      req.originalUrl = req.url;
    }
  }
  return app(req, res);
}