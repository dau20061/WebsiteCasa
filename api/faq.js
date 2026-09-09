import express from 'express';
import cors from 'cors';
import faqRoutes from '../backend/src/routes/faqRoutes.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use((req, res, next) => {
  if (req.query.id && (req.url === '/' || req.url === '')) {
    req.url = '/' + req.query.id;
  }
  next();
});

app.use('/api/faq', faqRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/faq', faqRoutes);
app.use('/faqs', faqRoutes);
app.use('/', faqRoutes);

export default app;
