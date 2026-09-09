// ============================================================================
// CASA TEA - VERCEL SERVERLESS FUNCTION
// Endpoint: POST /api/ai/translate-category-zh
// ============================================================================

import { translateCategoryToTraditionalChinese } from '../../backend/src/services/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const category = req.body || {};
    try {
      const result = await translateCategoryToTraditionalChinese(category);
      if (result) return res.status(200).json(result);
    } catch (e) {
      console.warn('[translate-category-zh] error:', e.message);
    }
    return res.status(200).json({
      nameZh: category.name || '',
      descZh: category.desc || ''
    });
  } catch (error) {
    return res.status(200).json({
      nameZh: req.body?.name || '',
      descZh: req.body?.desc || ''
    });
  }
}

