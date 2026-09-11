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
    console.warn('[AI Route design-product] Error:', err.message);
    res.json(req.body || {});
  }
});

router.post('/rewrite-desc', async (req, res) => {
  try {
    const result = await rewriteDescriptionWithGemini(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route rewrite-desc] Error:', err.message);
    res.json(req.body || {});
  }
});

router.post('/design-news', async (req, res) => {
  try {
    const result = await generateArticleWithGemini(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route design-news] Error:', err.message);
    res.json(req.body || {});
  }
});

router.post('/translate-product-zh', async (req, res) => {
  try {
    const result = await translateProductToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route translate-product-zh] Error:', err.message);
    res.json(req.body || {});
  }
});

router.post('/translate-news-zh', async (req, res) => {
  try {
    const result = await translateArticleToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route translate-news-zh] Error:', err.message);
    res.json({
      titleZh: req.body?.title || '',
      excerptZh: req.body?.excerpt || '',
      contentZh: req.body?.content || ''
    });
  }
});

router.post('/translate-faq-zh', async (req, res) => {
  try {
    const result = await translateFaqToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route translate-faq-zh] Error:', err.message);
    res.json({
      questionZh: req.body?.question || '',
      answerZh: req.body?.answer || ''
    });
  }
});

router.post('/translate-machinery-zh', async (req, res) => {
  try {
    const result = await translateMachineryToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route translate-machinery-zh] Error:', err.message);
    res.json(req.body || {});
  }
});

router.post('/translate-category-zh', async (req, res) => {
  try {
    const result = await translateCategoryToTraditionalChinese(req.body);
    res.json(result);
  } catch (err) {
    console.warn('[AI Route translate-category-zh] Error:', err.message);
    res.json(req.body || {});
  }
});

export default router;