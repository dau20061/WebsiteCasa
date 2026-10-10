import { getProducts } from '../backend/src/services/dbService.js';

const SITE_URL = 'https://www.nguyenlieuphachecasa.com';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  try {
    const rawSlug = req.query.slug || req.query.id || '';
    const cleanSlug = rawSlug.replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, '').trim().toLowerCase();

    if (!cleanSlug) {
      return res.redirect(302, `${SITE_URL}/logo.png`);
    }

    const products = await getProducts().catch(() => []);
    const product = (products || []).find((p) => {
      if (!p) return false;
      const pSlug = String(p.slug || '').toLowerCase();
      const pId = String(p.id || '').toLowerCase();
      const pNameSlug = p.name ? slugify(p.name).toLowerCase() : '';
      const pImageSlug = p.image ? p.image.split('/').pop().replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, '').toLowerCase() : '';
      return pSlug === cleanSlug || pId === cleanSlug || pNameSlug === cleanSlug || pImageSlug === cleanSlug;
    });

    if (!product) {
      return res.redirect(302, `${SITE_URL}/logo.png`);
    }

    const rawImage = product.imageData || product.imageBase64 || product.image;
    if (!rawImage) {
      return res.redirect(302, `${SITE_URL}/logo.png`);
    }

    // Nếu ảnh lưu dạng Base64 Data URL (data:image/...) -> Giải mã buffer nhị phân và trả về ảnh chuẩn
    if (rawImage.startsWith('data:image/')) {
      const matches = rawImage.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable');
        res.setHeader('Content-Length', buffer.length);
        return res.status(200).send(buffer);
      }
    }

    // Nếu ảnh là URL công khai (http / https) -> Chuyển hướng trực tiếp (trừ khi tự trỏ vào chính endpoint để tránh loop)
    if (
      (rawImage.startsWith('http://') || rawImage.startsWith('https://')) &&
      !rawImage.includes('/product-image/')
    ) {
      return res.redirect(302, rawImage);
    }

    // Intelligent Fallback theo loại nguyên liệu nếu imageData bị thiếu thay vì trả về logo
    const cat = String(product.category || product.categoryName || '').toLowerCase();
    const name = String(product.name || '').toLowerCase();

    if (cat.includes('topping') || name.includes('thạch') || name.includes('trân châu')) {
      return res.redirect(302, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80');
    }
    if (cat.includes('pudding') || cat.includes('tau-hu') || name.includes('pudding') || name.includes('tàu hủ')) {
      return res.redirect(302, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
    }
    if (cat.includes('kem') || cat.includes('beo') || name.includes('kem') || name.includes('béo')) {
      return res.redirect(302, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80');
    }
    if (cat.includes('syrup') || cat.includes('duong') || name.includes('syrup') || name.includes('siro')) {
      return res.redirect(302, 'https://images.unsplash.com/photo-1558857563-b37fcfeee58c?auto=format&fit=crop&w=800&q=80');
    }
    if (cat.includes('matcha') || name.includes('matcha')) {
      return res.redirect(302, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80');
    }
    if (cat.includes('tra') || cat.includes('tea') || name.includes('trà')) {
      return res.redirect(302, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80');
    }

    return res.redirect(302, `${SITE_URL}/logo.png`);
  } catch (error) {
    console.error('[Product Image Handler Error]:', error);
    return res.redirect(302, `${SITE_URL}/logo.png`);
  }
}

