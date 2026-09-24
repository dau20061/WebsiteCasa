import { Router } from 'express';
import { getProducts, getProductById, saveProduct, deleteProduct } from '../services/dbService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/image', async (req, res) => {
  try {
    const rawId = req.params.id || '';
    const cleanId = rawId.replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, '').trim().toLowerCase();
    const products = await getProducts();
    const product = products.find((p) => {
      const pSlug = String(p.slug || '').toLowerCase();
      const pId = String(p.id || '').toLowerCase();
      return pSlug === cleanId || pId === cleanId;
    });

    if (!product || !product.image) {
      return res.redirect(302, 'https://www.nguyenlieuphachecasa.com/logo.png');
    }

    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      return res.redirect(302, product.image);
    }

    if (product.image.startsWith('data:image/')) {
      const matches = product.image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Content-Length', buffer.length);
        return res.status(200).send(buffer);
      }
    }

    return res.redirect(302, 'https://www.nguyenlieuphachecasa.com/logo.png');
  } catch (err) {
    return res.redirect(302, 'https://www.nguyenlieuphachecasa.com/logo.png');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const saved = await saveProduct(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const saved = await saveProduct({ ...req.body, id: req.params.id });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteProduct(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
