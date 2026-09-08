import { Router } from 'express';
import {
  generateProductWithGemini,
  rewriteDescriptionWithGemini,
  generateArticleWithGemini,
  translateProductToTraditionalChinese,
  translateArticleToTraditionalChinese,
  translateFaqToTraditionalChinese,
  translateMachineryToTraditionalChinese,
  translateCategoryToTraditionalChinese
} from '../services/aiService.js';

const router = Router();

router.post('/design-product', async (req, res) => {
  try {
    const result = await generateProductWithGemini(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/rewrite-desc', async (req, res) => {
  try {
    const result = await rewriteDescriptionWithGemini(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/design-news', async (req, res) => {
  try {
    const result = await generateArticleWithGemini(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/translate-product-zh', async (req, res) => {
  try {
    const result = await translateProductToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/translate-news-zh', async (req, res) => {
  try {
    const result = await translateArticleToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/translate-faq-zh', async (req, res) => {
  try {
    const result = await translateFaqToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/translate-machinery-zh', async (req, res) => {
  try {
    const result = await translateMachineryToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/translate-category-zh', async (req, res) => {
  try {
    const result = await translateCategoryToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
