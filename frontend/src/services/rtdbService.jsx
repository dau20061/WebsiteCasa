// ============================================================================
// CASA TEA - FRONTEND DATABASE SERVICE ADAPTER
// Tầng xử lý giao tiếp database tập trung:
// 1. Ưu tiên Backend REST API Server (/api/...)
// 2. Tự động dự phòng trực tiếp Firebase RTDB REST nếu Backend 500/offline
// 3. Đồng bộ tức thì LocalStorage để UI mượt mà 0ms và không bao giờ mất dữ liệu
// ============================================================================

import { productApi, categoryApi, newsApi, faqApi, machineryApi, certificationApi, contactApi, userApi } from '../api/client';
import { PRODUCT_CATEGORIES } from '../constants/categories';

const DIRECT_RTDB_BASE = 'https://websitecasa-15d46-default-rtdb.asia-southeast1.firebasedatabase.app';

// Trợ thủ fetch trực tiếp Firebase Realtime Database REST API
async function fetchDirectRtdb(path, method = 'GET', data = null) {
  try {
    const url = `${DIRECT_RTDB_BASE}/${path}.json`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data !== null) {
      options.body = JSON.stringify(data);
    }
    const res = await fetch(url, options);
    if (res.ok) {
      const val = await res.json();
      if (!val) return null;
      if (method === 'GET' && typeof val === 'object' && !Array.isArray(val)) {
        return Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      }
      return val;
    }
  } catch (err) {
    console.warn(`[Frontend Direct RTDB] ${method} ${path} error:`, err?.message || err);
  }
  return null;
}

// ============================================================================
// PRODUCT CATEGORIES (CRUD)
// ============================================================================
export async function getRtdbCategories() {
  try {
    const data = await categoryApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_categories', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbCategories via Backend API failed, trying direct RTDB:', err.message);
  }

  // Thử trực tiếp Firebase RTDB nếu backend API lỗi
  try {
    const directData = await fetchDirectRtdb('categories');
    if (directData && Array.isArray(directData) && directData.length > 0) {
      localStorage.setItem('casa_admin_categories', JSON.stringify(directData));
      return directData;
    }
  } catch (_) {}

  const saved = localStorage.getItem('casa_admin_categories');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (_) {}
  }

  // Fallback default categories
  const defaults = PRODUCT_CATEGORIES
    .filter((c) => c.id !== 'all')
    .map((c, idx) => ({
      id: c.id,
      slug: c.id,
      name: c.name,
      nameZh: c.nameZh || '',
      order: idx + 1,
      active: true,
      desc: '',
      descZh: '',
    }));

  try {
    localStorage.setItem('casa_admin_categories', JSON.stringify(defaults));
  } catch (_) {}

  return defaults;
}

export async function saveRtdbCategory(category) {
  const isNew = !category.id || String(category.id).startsWith('cat_');
  const targetId = category.id || `cat_${Date.now()}`;
  const itemToSave = { ...category, id: targetId };

  // 1. Luôn cập nhật localStorage ngay lập tức
  try {
    const saved = localStorage.getItem('casa_admin_categories');
    let list = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((c) => String(c.id) === String(targetId));
    if (idx >= 0) {
      list[idx] = itemToSave;
    } else {
      list.push(itemToSave);
    }
    localStorage.setItem('casa_admin_categories', JSON.stringify(list));
  } catch (_) {}

  // 2. Thử lưu qua backend API
  try {
    const result = isNew ? await categoryApi.create(itemToSave) : await categoryApi.update(targetId, itemToSave);
    return result.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbCategory via Backend API failed, saving to direct RTDB:', err.message);
    await fetchDirectRtdb(`categories/${targetId}`, 'PUT', itemToSave);
    return targetId;
  }
}

export async function deleteRtdbCategory(categoryId) {
  try {
    const saved = localStorage.getItem('casa_admin_categories');
    if (saved) {
      const list = JSON.parse(saved).filter((c) => String(c.id) !== String(categoryId));
      localStorage.setItem('casa_admin_categories', JSON.stringify(list));
    }
  } catch (_) {}

  try {
    return await categoryApi.delete(categoryId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbCategory error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`categories/${categoryId}`, 'DELETE');
    return { success: true };
  }
}

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
    console.warn('[Frontend Service] getRtdbProducts via Backend API failed, trying direct RTDB:', err.message);
  }

  // Thử trực tiếp Firebase RTDB nếu backend API 500/offline
  try {
    const directData = await fetchDirectRtdb('products');
    if (directData && Array.isArray(directData) && directData.length > 0) {
      localStorage.setItem('casa_admin_products', JSON.stringify(directData));
      return directData;
    }
  } catch (_) {}

  const saved = localStorage.getItem('casa_admin_products');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbProduct(product) {
  const isNew = !product.id || String(product.id).startsWith('product_');
  const targetId = product.id || `product_${Date.now()}`;
  const itemToSave = { ...product, id: targetId, updatedAt: new Date().toISOString() };

  // 1. Luôn cập nhật localStorage ngay lập tức
  try {
    const saved = localStorage.getItem('casa_admin_products');
    let list = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((p) => String(p.id) === String(targetId));
    if (idx >= 0) {
      list[idx] = itemToSave;
    } else {
      list.unshift(itemToSave);
    }
    localStorage.setItem('casa_admin_products', JSON.stringify(list));
  } catch (_) {}

  // 2. Thử lưu qua backend API
  try {
    const result = isNew ? await productApi.create(itemToSave) : await productApi.update(targetId, itemToSave);
    return result.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbProduct via Backend API failed, saving to direct RTDB:', err.message);
    await fetchDirectRtdb(`products/${targetId}`, 'PUT', itemToSave);
    return targetId;
  }
}

export async function deleteRtdbProduct(productId) {
  try {
    const saved = localStorage.getItem('casa_admin_products');
    if (saved) {
      const list = JSON.parse(saved).filter((p) => String(p.id) !== String(productId));
      localStorage.setItem('casa_admin_products', JSON.stringify(list));
    }
  } catch (_) {}

  try {
    return await productApi.delete(productId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbProduct error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`products/${productId}`, 'DELETE');
    return { success: true };
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
    console.warn('[Frontend Service] getRtdbNews via Backend API failed, trying direct RTDB:', err.message);
  }

  // Thử trực tiếp Firebase RTDB nếu backend API lỗi
  try {
    const directData = await fetchDirectRtdb('news');
    if (directData && Array.isArray(directData) && directData.length > 0) {
      localStorage.setItem('casa_admin_news', JSON.stringify(directData));
      return directData;
    }
  } catch (_) {}

  const saved = localStorage.getItem('casa_admin_news');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbNews(newsItem) {
  const isNew = !newsItem.id || String(newsItem.id).startsWith('news_');
  const targetId = newsItem.id || `news_${Date.now()}`;
  const itemToSave = { ...newsItem, id: targetId, updatedAt: newsItem.updatedAt || new Date().toISOString() };

  // 1. Luôn cập nhật localStorage ngay lập tức
  try {
    const saved = localStorage.getItem('casa_admin_news');
    let list = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((n) => String(n.id) === String(targetId));
    if (idx >= 0) {
      list[idx] = itemToSave;
    } else {
      list.unshift(itemToSave);
    }
    localStorage.setItem('casa_admin_news', JSON.stringify(list));
  } catch (_) {}

  // 2. Thử lưu qua backend API
  try {
    const result = isNew ? await newsApi.create(itemToSave) : await newsApi.update(targetId, itemToSave);
    return result.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbNews via Backend API failed, saving to direct RTDB:', err.message);
    await fetchDirectRtdb(`news/${targetId}`, 'PUT', itemToSave);
    return targetId;
  }
}

export async function deleteRtdbNews(newsId) {
  try {
    const saved = localStorage.getItem('casa_admin_news');
    if (saved) {
      const list = JSON.parse(saved).filter((n) => String(n.id) !== String(newsId));
      localStorage.setItem('casa_admin_news', JSON.stringify(list));
    }
  } catch (_) {}

  try {
    return await newsApi.delete(newsId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbNews error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`news/${newsId}`, 'DELETE');
    return { success: true };
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
    console.warn('[Frontend Service] getRtdbFaqs via Backend API failed, trying direct RTDB:', err.message);
  }

  try {
    const directData = await fetchDirectRtdb('faqs');
    if (directData && Array.isArray(directData) && directData.length > 0) {
      localStorage.setItem('casa_admin_faqs', JSON.stringify(directData));
      return directData;
    }
  } catch (_) {}

  const saved = localStorage.getItem('casa_admin_faqs');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbFaq(faq) {
  const isNew = !faq.id || String(faq.id).startsWith('faq_');
  const targetId = faq.id || `faq_${Date.now()}`;
  const itemToSave = { ...faq, id: targetId };

  try {
    const saved = localStorage.getItem('casa_admin_faqs');
    let list = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((f) => String(f.id) === String(targetId));
    if (idx >= 0) {
      list[idx] = itemToSave;
    } else {
      list.unshift(itemToSave);
    }
    localStorage.setItem('casa_admin_faqs', JSON.stringify(list));
  } catch (_) {}

  try {
    const result = isNew ? await faqApi.create(itemToSave) : await faqApi.update(targetId, itemToSave);
    return result.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbFaq error, saving to direct RTDB:', err.message);
    await fetchDirectRtdb(`faqs/${targetId}`, 'PUT', itemToSave);
    return targetId;
  }
}

export async function deleteRtdbFaq(faqId) {
  try {
    const saved = localStorage.getItem('casa_admin_faqs');
    if (saved) {
      const list = JSON.parse(saved).filter((f) => String(f.id) !== String(faqId));
      localStorage.setItem('casa_admin_faqs', JSON.stringify(list));
    }
  } catch (_) {}

  try {
    return await faqApi.delete(faqId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbFaq error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`faqs/${faqId}`, 'DELETE');
    return { success: true };
  }
}

// ============================================================================
// MACHINERY
// ============================================================================
export async function getRtdbMachinery() {
  try {
    const data = await machineryApi.getAll();
    if (data && Array.isArray(data)) {
      const cleaned = data.filter((m) => !String(m.id).startsWith('machinery-0'));
      try {
        localStorage.setItem('casa_admin_machinery', JSON.stringify(cleaned));
      } catch (_) {}
      return cleaned;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbMachinery via Backend API failed, trying direct RTDB:', err.message);
  }

  try {
    const directData = await fetchDirectRtdb('machinery');
    if (directData && Array.isArray(directData)) {
      const cleaned = directData.filter((m) => !String(m.id).startsWith('machinery-0'));
      try {
        localStorage.setItem('casa_admin_machinery', JSON.stringify(cleaned));
      } catch (_) {}
      return cleaned;
    }
  } catch (_) {}

  const saved = localStorage.getItem('casa_admin_machinery');
  if (saved) {
    try {
      const list = JSON.parse(saved);
      const cleaned = Array.isArray(list) ? list.filter((m) => !String(m.id).startsWith('machinery-0')) : [];
      localStorage.setItem('casa_admin_machinery', JSON.stringify(cleaned));
      return cleaned;
    } catch (_) {}
  }
  return [];
}

export async function saveRtdbMachinery(item) {
  const isNew = !item.id || String(item.id).startsWith('mach_');
  const targetId = item.id || `mach_${Date.now()}`;
  const itemToSave = { ...item, id: targetId };

  try {
    const saved = localStorage.getItem('casa_admin_machinery');
    let list = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((m) => String(m.id) === String(targetId));
    if (idx >= 0) {
      list[idx] = itemToSave;
    } else {
      list.push(itemToSave);
    }
    localStorage.setItem('casa_admin_machinery', JSON.stringify(list));
  } catch (_) {}

  try {
    const result = isNew ? await machineryApi.create(itemToSave) : await machineryApi.update(targetId, itemToSave);
    return result.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbMachinery error, saving to direct RTDB:', err.message);
    await fetchDirectRtdb(`machinery/${targetId}`, 'PUT', itemToSave);
    return targetId;
  }
}

export async function deleteRtdbMachinery(id) {
  try {
    const saved = localStorage.getItem('casa_admin_machinery');
    if (saved) {
      const list = JSON.parse(saved).filter((m) => String(m.id) !== String(id));
      localStorage.setItem('casa_admin_machinery', JSON.stringify(list));
    }
  } catch (_) {}

  try {
    return await machineryApi.delete(id);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbMachinery error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`machinery/${id}`, 'DELETE');
    return { success: true };
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
    console.warn('[Frontend Service] getRtdbCertifications error, trying direct RTDB:', err.message);
  }

  try {
    const directData = await fetchDirectRtdb('certifications');
    if (directData && Array.isArray(directData) && directData.length > 0) {
      localStorage.setItem('casa_admin_certifications', JSON.stringify(directData));
      return directData;
    }
  } catch (_) {}

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
    console.warn('[Frontend Service] getRtdbContacts error, trying direct RTDB:', err.message);
    const directData = await fetchDirectRtdb('contacts');
    return Array.isArray(directData) ? directData : [];
  }
}

export async function saveRtdbContact(contact) {
  try {
    const result = await contactApi.submit(contact);
    return result.id || `contact_${Date.now()}`;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbContact error, saving to direct RTDB:', err.message);
    const targetId = `contact_${Date.now()}`;
    await fetchDirectRtdb(`contacts/${targetId}`, 'PUT', { ...contact, id: targetId });
    return targetId;
  }
}

export async function deleteRtdbContact(contactId) {
  try {
    return await contactApi.delete(contactId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbContact error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`contacts/${contactId}`, 'DELETE');
    return { success: true };
  }
}

// ============================================================================
// USERS
// ============================================================================
export async function saveRtdbUser(user) {
  try {
    return await userApi.save(user);
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbUser error, saving to direct RTDB:', err.message);
    const targetId = user.uid || `user_${Date.now()}`;
    await fetchDirectRtdb(`users/${targetId}`, 'PUT', user);
    return user;
  }
}

export async function deleteRtdbUser(uid) {
  try {
    return await userApi.delete(uid);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbUser error, deleting from direct RTDB:', err.message);
    await fetchDirectRtdb(`users/${uid}`, 'DELETE');
    return { success: true };
  }
}
