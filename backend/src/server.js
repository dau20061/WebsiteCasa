import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import machineryRoutes from './routes/machineryRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CASA TEA Backend API Server',
    time: new Date().toISOString()
  });
});

// Mount Routes (luôn có tiền tố /api, chỉ hỗ trợ không có tiền tố /api khi chạy trên Vercel Serverless)
const routeList = [
  ['/products', productRoutes],
  ['/categories', categoryRoutes],
  ['/news', newsRoutes],
  ['/faq', faqRoutes],
  ['/faqs', faqRoutes],
  ['/machinery', machineryRoutes],
  ['/certifications', certificationRoutes],
  ['/contacts', contactRoutes],
  ['/ai', aiRoutes],
  ['/users', userRoutes],
];

for (const [routePath, router] of routeList) {
  app.use(`/api${routePath}`, router);
  if (process.env.VERCEL) {
    app.use(routePath, router);
  }
}

// 404 handler
// Phục vụ giao diện Frontend tĩnh nếu đã build (hỗ trợ Hostinger Node.js, VPS, PM2)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`CASA TEA Backend Server is running on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log('====================================================');
  });
}

export default app;
