// ============================================================================
// CASA TEA - URL SLUG GENERATOR UTILITIES
// Tạo đường dẫn thân thiện SEO từ tên tiếng Việt (ví dụ: "syrup chanh dây" -> "syrup-chanh-day")
// ============================================================================

export function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

export function getProductSlug(product) {
  if (!product) return '';
  if (product.slug && typeof product.slug === 'string' && product.slug.trim()) {
    return product.slug.trim();
  }
  if (product.name && typeof product.name === 'string' && product.name.trim()) {
    return slugify(product.name);
  }
  return product.id || '';
}

