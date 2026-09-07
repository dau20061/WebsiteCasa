import { Router } from 'express';
import { getCertifications } from '../services/dbService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const certs = await getCertifications();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
