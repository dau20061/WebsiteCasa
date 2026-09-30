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

export function getArticleSlug(article) {
  if (!article) return '';
  if (article.slug && typeof article.slug === 'string' && article.slug.trim()) {
    return article.slug.trim();
  }
  if (article.title && typeof article.title === 'string' && article.title.trim()) {
    return slugify(article.title);
  }
  return article.id || '';
}

export function getProductImageUrl(product) {
  if (!product) return 'https://www.nguyenlieuphachecasa.com/logo.png';
  const img = product.image;
  // Nếu đã là link HTTPS ngoài hoặc đã là link endpoint chuẩn
  if (img && typeof img === 'string') {
    if ((img.startsWith('http://') || img.startsWith('https://')) && !img.startsWith('data:')) {
      return img;
    }
  }
  // Nếu là Base64 data:image/... hoặc chưa có link chuẩn -> Trả về URL endpoint chuẩn HTTPS
  const slug = getProductSlug(product);
  if (slug) {
    return `https://www.nguyenlieuphachecasa.com/product-image/${slug}.webp`;
  }
  return (img && typeof img === 'string' && !img.startsWith('data:')) ? img : 'https://www.nguyenlieuphachecasa.com/logo.png';
}

export function getArticleImageUrl(article) {
  if (!article) return 'https://www.nguyenlieuphachecasa.com/logo.png';
  const img = article.image;
  if (img && typeof img === 'string') {
    if ((img.startsWith('http://') || img.startsWith('https://')) && !img.startsWith('data:')) {
      return img;
    }
  }
  const slug = getArticleSlug(article);
  if (slug) {
    return `https://www.nguyenlieuphachecasa.com/article-image/${slug}.webp`;
  }
  return (img && typeof img === 'string' && !img.startsWith('data:')) ? img : 'https://www.nguyenlieuphachecasa.com/logo.png';
}


