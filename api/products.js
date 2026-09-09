import express from 'express';
import cors from 'cors';
import productRoutes from '../backend/src/routes/productRoutes.js';

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

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/', productRoutes);

export default app;

