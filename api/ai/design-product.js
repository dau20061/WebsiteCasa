import { generateProductWithGemini } from '../../backend/src/services/aiService.js';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await generateProductWithGemini(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    console.warn('[Serverless design-product.js] Warning:', error.message);
    return res.status(200).json(req.body || {});
  }
}

