// ============================================================================
// CASA TEA - VERCEL SERVERLESS FUNCTION
// Endpoint: POST /api/ai/design-news
// ============================================================================

import { generateArticleWithGemini } from '../../backend/src/services/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await generateArticleWithGemini(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    console.error('[design-news] error:', error);
    return res.status(500).json({ error: error.message || 'Unable to design news' });
  }
}

