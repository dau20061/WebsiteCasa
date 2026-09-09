// ============================================================================
// CASA TEA - VERCEL SERVERLESS FUNCTION
// Endpoint: POST /api/ai/translate-faq-zh
// ============================================================================

import { translateFaqToTraditionalChinese } from '../../backend/src/services/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const faq = req.body || {};
    try {
      const result = await translateFaqToTraditionalChinese(faq);
      if (result) return res.status(200).json(result);
    } catch (e) {
      console.warn('[translate-faq-zh] error:', e.message);
    }
    return res.status(200).json({
      questionZh: faq.question || '',
      answerZh: faq.answer || ''
    });
  } catch (error) {
    return res.status(200).json({
      questionZh: req.body?.question || '',
      answerZh: req.body?.answer || ''
    });
  }
}

