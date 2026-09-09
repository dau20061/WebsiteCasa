import express from 'express';
import cors from 'cors';
import userRoutes from '../backend/src/routes/userRoutes.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use((req, res, next) => {
  if (req.query.uid && (req.url === '/' || req.url === '')) {
    req.url = '/' + req.query.uid;
  }
  next();
});

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);
app.use('/', userRoutes);

export default app;
