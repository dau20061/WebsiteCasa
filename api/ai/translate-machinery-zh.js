// ============================================================================
// CASA TEA - VERCEL SERVERLESS FUNCTION
// Endpoint: POST /api/ai/translate-machinery-zh
// ============================================================================

import { translateMachineryToTraditionalChinese } from '../../backend/src/services/aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const machinery = req.body || {};
    try {
      const result = await translateMachineryToTraditionalChinese(machinery);
      if (result) return res.status(200).json(result);
    } catch (e) {
      console.warn('[translate-machinery-zh] error:', e.message);
    }
    return res.status(200).json({
      nameZh: machinery.name || '',
      categoryZh: machinery.category || '',
      originZh: machinery.origin || '',
      capacityZh: machinery.capacity || '',
      descriptionZh: machinery.description || machinery.desc || ''
    });
  } catch (error) {
    return res.status(200).json({
      nameZh: req.body?.name || '',
      categoryZh: req.body?.category || '',
      originZh: req.body?.origin || '',
      capacityZh: req.body?.capacity || '',
      descriptionZh: req.body?.description || req.body?.desc || ''
    });
  }
}

