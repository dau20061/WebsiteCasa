import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import productRoutes from './routes/productRoutes.js';
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

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🍵 CASA TEA Backend Server is running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log('====================================================');
});

export default app;
