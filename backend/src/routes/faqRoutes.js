import { Router } from 'express';
import { getFaqs, saveFaq, deleteFaq } from '../services/dbService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const faqs = await getFaqs();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const saved = await saveFaq(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const saved = await saveFaq({ ...req.body, id: req.params.id });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteFaq(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
