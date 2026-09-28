import app from '../backend/src/server.js';
import { getProducts } from '../backend/src/services/dbService.js';

export default async function handler(req, res) {
  if (req.method === 'GET' && (!req.query || Object.keys(req.query).length === 0)) {
    try {
      const products = await getProducts();
      const lightweightProducts = (products || []).map((p) => {
        const { imageData, imageBase64, ...rest } = p;
        if (rest.image && rest.image.includes('/product-image/') && !rest.image.includes('?v=')) {
          const vTime = new Date(rest.updatedAt || rest.createdAt || Date.now()).getTime();
          rest.image = `${rest.image.split('?')[0]}?v=${vTime}`;
          if (Array.isArray(rest.images) && rest.images.length > 0) {
            rest.images = [rest.image];
          }
        }
        return rest;
      });
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=30, stale-while-revalidate=60');
      return res.status(200).json(lightweightProducts);
    } catch (err) {
      console.error('[API Products Error]:', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  return app(req, res);
}
