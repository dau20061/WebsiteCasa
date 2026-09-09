import express from 'express';
import cors from 'cors';
import certificationRoutes from '../backend/src/routes/certificationRoutes.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/certifications', certificationRoutes);
app.use('/certifications', certificationRoutes);
app.use('/', certificationRoutes);

export default app;

