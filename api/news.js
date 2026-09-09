import express from 'express';
import cors from 'cors';
import newsRoutes from '../backend/src/routes/newsRoutes.js';

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

app.use('/api/news', newsRoutes);
app.use('/news', newsRoutes);
app.use('/', newsRoutes);

export default app;

