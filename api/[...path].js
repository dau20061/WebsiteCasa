import app from '../backend/src/server.js';

export default function handler(req, res) {
  if (req.url && req.url.includes('[...path]')) {
    const rawPath = req.query.path || '';
    const subPath = Array.isArray(rawPath) ? rawPath.join('/') : rawPath;
    const cleanPath = String(subPath).replace(/\.js$/i, '');
    const cleanUrl = (`/api/${cleanPath}`).replace(/\/+/g, '/');
    req.url = cleanUrl;
    req.originalUrl = cleanUrl;
  }
  return app(req, res);
}