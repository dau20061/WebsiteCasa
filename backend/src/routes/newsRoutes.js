import { Router } from 'express';
import { getNews, getNewsById, saveNews, deleteNews } from '../services/dbService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const news = await getNews();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await getNewsById(req.params.id);
    if (!item) return res.status(404).json({ error: 'News not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const saved = await saveNews(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const saved = await saveNews({ ...req.body, id: req.params.id });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteNews(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
