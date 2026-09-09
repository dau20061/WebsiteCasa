import express from 'express';
import cors from 'cors';
import machineryRoutes from '../backend/src/routes/machineryRoutes.js';

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

app.use('/api/machinery', machineryRoutes);
app.use('/machinery', machineryRoutes);
app.use('/', machineryRoutes);

export default app;
