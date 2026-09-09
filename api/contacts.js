import express from 'express';
import cors from 'cors';
import contactRoutes from '../backend/src/routes/contactRoutes.js';

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

app.use('/api/contacts', contactRoutes);
app.use('/contacts', contactRoutes);
app.use('/', contactRoutes);

export default app;

