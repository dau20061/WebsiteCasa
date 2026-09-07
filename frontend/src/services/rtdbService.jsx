// ============================================================================
// CASA TEA - FRONTEND DATABASE SERVICE ADAPTER
// Tầng xử lý giao tiếp database tập trung qua Backend REST API Server (/api/...)
// ============================================================================

import { productApi, newsApi, faqApi, machineryApi, certificationApi, contactApi, userApi } from '../api/client';

// ============================================================================
// PRODUCTS
// ============================================================================
export async function getRtdbProducts() {
  try {
    const data = await productApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_products', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbProducts via Backend API failed, using cached fallback:', err.message);
  }

  const saved = localStorage.getItem('casa_admin_products');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbProduct(product) {
  try {
    const isNew = !product.id || String(product.id).startsWith('product_');
    const result = isNew ? await productApi.create(product) : await productApi.update(product.id, product);
    return result.id || product.id;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbProduct error:', err.message);
    return product.id;
  }
}

export async function deleteRtdbProduct(productId) {
  try {
    return await productApi.delete(productId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbProduct error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// NEWS & ARTICLES
// ============================================================================
export async function getRtdbNews() {
  try {
    const data = await newsApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_news', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbNews via Backend API failed, using cached fallback:', err.message);
  }

  const saved = localStorage.getItem('casa_admin_news');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbNews(newsItem) {
  try {
    const isNew = !newsItem.id || String(newsItem.id).startsWith('news_');
    const result = isNew ? await newsApi.create(newsItem) : await newsApi.update(newsItem.id, newsItem);
    return result.id || newsItem.id;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbNews error:', err.message);
    return newsItem.id;
  }
}

export async function deleteRtdbNews(newsId) {
  try {
    return await newsApi.delete(newsId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbNews error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// FAQS
// ============================================================================
export async function getRtdbFaqs() {
  try {
    const data = await faqApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_faqs', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbFaqs via Backend API failed, using cached fallback:', err.message);
  }

  const saved = localStorage.getItem('casa_admin_faqs');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbFaq(faq) {
  try {
    const isNew = !faq.id || String(faq.id).startsWith('faq_');
    const result = isNew ? await faqApi.create(faq) : await faqApi.update(faq.id, faq);
    return result.id || faq.id;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbFaq error:', err.message);
    return faq.id;
  }
}

export async function deleteRtdbFaq(faqId) {
  try {
    return await faqApi.delete(faqId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbFaq error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// MACHINERY
// ============================================================================
export async function getRtdbMachinery() {
  try {
    const data = await machineryApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_machinery', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbMachinery via Backend API failed, using cached fallback:', err.message);
  }

  const saved = localStorage.getItem('casa_admin_machinery');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbMachinery(item) {
  try {
    const isNew = !item.id || String(item.id).startsWith('mach_');
    const result = isNew ? await machineryApi.create(item) : await machineryApi.update(item.id, item);
    return result.id || item.id;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbMachinery error:', err.message);
    return item.id;
  }
}

export async function deleteRtdbMachinery(id) {
  try {
    return await machineryApi.delete(id);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbMachinery error:', err.message);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// CERTIFICATIONS
// ============================================================================
export async function getRtdbCertifications() {
  try {
    const data = await certificationApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_certifications', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbCertifications error:', err.message);
  }
  const saved = localStorage.getItem('casa_admin_certifications');
  return saved ? JSON.parse(saved) : [];
}

// ============================================================================
// CONTACTS & SAMPLES
// ============================================================================
export async function getRtdbContacts() {
  try {
    return await contactApi.getAll();
  } catch (err) {
    console.warn('[Frontend Service] getRtdbContacts error:', err.message);
    return [];
  }
}

export async function saveRtdbContact(contact) {
  try {
    const result = await contactApi.submit(contact);
    return result.id || `contact_${Date.now()}`;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbContact error:', err.message);
    return `contact_${Date.now()}`;
  }
}

export async function deleteRtdbContact(contactId) {
  try {
    return await contactApi.delete(contactId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbContact error:', err.message);
    return { success: false };
  }
}

// ============================================================================
// USERS
// ============================================================================
export async function saveRtdbUser(user) {
  try {
    return await userApi.save(user);
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbUser error:', err.message);
    return user;
  }
}

export async function deleteRtdbUser(uid) {
  try {
    return await userApi.delete(uid);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbUser error:', err.message);
    return { success: false };
  }
}
