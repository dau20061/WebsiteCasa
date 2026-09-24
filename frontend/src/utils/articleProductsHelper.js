/**
 * Helper utility to match and resolve attached/related products for articles & recipes.
 * Supports explicit manual selection + smart automatic recommendation fallback.
 */

/**
 * Automatically analyze an article's text (title, content, tags, recipe ingredients)
 * to suggest the most relevant product IDs from the available products catalog.
 */
export function autoSuggestProductIdsForArticle(article = {}, allProducts = []) {
  if (!allProducts || allProducts.length === 0) return [];

  const textToScan = [
    article.title,
    article.titleZh,
    article.titleEn,
    article.excerpt,
    article.content,
    article.category,
    Array.isArray(article.tags) ? article.tags.join(' ') : '',
    article.recipeBox?.title,
    Array.isArray(article.recipeBox?.ingredients) ? article.recipeBox.ingredients.join(' ') : ''
  ].filter(Boolean).join(' ').toLowerCase();

  const scored = allProducts.map((product) => {
    let score = 0;
    const name = (product.name || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();
    const catName = (product.categoryName || '').toLowerCase();
    const sku = (product.sku || '').toLowerCase();
    const desc = (product.shortDesc || product.description || '').toLowerCase();

    // 1. Exact product name match
    if (name && textToScan.includes(name)) {
      score += 15;
    }

    // 2. Specialized keyword matching for F&B categories
    // Bột Kem Béo / Bột Béo / Non-Dairy Creamer
    const isCreamerArticle = textToScan.includes('bột kem') ||
      textToScan.includes('bột béo') ||
      textToScan.includes('bot kem') ||
      textToScan.includes('bot beo') ||
      textToScan.includes('creamer') ||
      textToScan.includes('kem béo');
    if (isCreamerArticle && (cat.includes('kem') || cat.includes('beo') || name.includes('kem') || name.includes('béo') || name.includes('creamer'))) {
      score += 12;
    }

    // Syrup / Siro / Chanh Dây / Bí Đao
    const isSyrupArticle = textToScan.includes('syrup') || textToScan.includes('siro') || textToScan.includes('chanh dây') || textToScan.includes('bí đao');
    if (isSyrupArticle && (cat.includes('syrup') || name.includes('syrup') || name.includes('siro'))) {
      score += 12;
    }

    // Trà Ô Long / Oolong / Nướng
    const isOolongArticle = textToScan.includes('ô long') || textToScan.includes('oolong') || textToScan.includes('nướng');
    if (isOolongArticle && (cat.includes('oolong') || name.includes('ô long') || name.includes('oolong'))) {
      score += 10;
    }

    // Trà Đen / Black Tea / Assam
    const isBlackTeaArticle = textToScan.includes('trà đen') || textToScan.includes('black tea') || textToScan.includes('assam') || textToScan.includes('ctc');
    if (isBlackTeaArticle && (cat.includes('den') || name.includes('đen') || name.includes('assam'))) {
      score += 10;
    }

    // Trà Lài / Trà Xanh / Jasmine
    const isJasmineArticle = textToScan.includes('lài') || textToScan.includes('nhài') || textToScan.includes('jasmine') || textToScan.includes('lục trà');
    if (isJasmineArticle && (cat.includes('lai') || name.includes('lài') || name.includes('nhài') || name.includes('lục trà'))) {
      score += 10;
    }

    // Matcha
    const isMatchaArticle = textToScan.includes('matcha') || textToScan.includes('trà xanh nhật');
    if (isMatchaArticle && (cat.includes('matcha') || name.includes('matcha'))) {
      score += 12;
    }

    // Topping / Pudding / Tàu hũ / Thạch
    const isToppingArticle = textToScan.includes('topping') || textToScan.includes('pudding') || textToScan.includes('tàu hũ') || textToScan.includes('thạch');
    if (isToppingArticle && (cat.includes('topping') || cat.includes('pudding') || cat.includes('tau-hu') || name.includes('pudding') || name.includes('tàu hũ'))) {
      score += 10;
    }

    // 3. Word-by-word token matching
    const tokens = name.split(/\s+/).filter((t) => t.length > 2);
    tokens.forEach((token) => {
      if (textToScan.includes(token)) score += 2;
    });

    return { id: product.id, score };
  });

  return scored
    .filter((item) => item.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.id);
}

/**
 * Resolve the final list of product objects for an article.
 * 1. Checks explicit `relatedProductIds`.
 * 2. If empty or insufficient, supplements with auto-matched products.
 */
export function resolveArticleProducts(article = {}, allProducts = []) {
  if (!allProducts || allProducts.length === 0) return [];

  const explicitIds = Array.isArray(article.relatedProductIds)
    ? article.relatedProductIds
    : (Array.isArray(article.relatedProducts) ? article.relatedProducts : []);

  // 1. Resolve explicitly attached products
  const explicitProducts = [];
  explicitIds.forEach((id) => {
    const found = allProducts.find((p) => String(p.id) === String(id) || String(p.slug) === String(id));
    if (found && !explicitProducts.some((p) => p.id === found.id)) {
      explicitProducts.push(found);
    }
  });

  // If already has 3 or more explicit products, return them
  if (explicitProducts.length >= 3) {
    return explicitProducts;
  }

  // 2. Smart fallback recommendation
  const suggestedIds = autoSuggestProductIdsForArticle(article, allProducts);
  const result = [...explicitProducts];

  suggestedIds.forEach((sId) => {
    if (result.length < 4 && !result.some((p) => String(p.id) === String(sId))) {
      const found = allProducts.find((p) => String(p.id) === String(sId));
      if (found) result.push(found);
    }
  });

  return result;
}

