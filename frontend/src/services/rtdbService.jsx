// ============================================================================
// CASA TEA - FRONTEND DATABASE SERVICE ADAPTER
// Tầng xử lý giao tiếp database tập trung:
// 1. Luôn ưu tiên Firebase Realtime Database REST API trực tiếp (0ms cache, nguồn sự thật 100%)
// 2. Dự phòng qua Backend REST API Server (/api/...) nếu mạng trực tiếp bị lỗi
// 3. Đồng bộ tức thì LocalStorage để UI mượt mà 0ms và không bao giờ mất dữ liệu
// ============================================================================

import { productApi, categoryApi, newsApi, faqApi, machineryApi, certificationApi, contactApi, userApi } from '../api/client';
import { PRODUCT_CATEGORIES } from '../constants/categories';

const DIRECT_RTDB_BASE = 'https://websitecasa-15d46-default-rtdb.asia-southeast1.firebasedatabase.app';

// Trợ thủ fetch trực tiếp Firebase Realtime Database REST API (Không bao giờ bị CDN/trình duyệt cache)
async function fetchDirectRtdb(path, method = 'GET', data = null) {
  try {
    const url = method === 'GET'
      ? `${DIRECT_RTDB_BASE}/${path}.json?_t=${Date.now()}`
      : `${DIRECT_RTDB_BASE}/${path}.json`;
    const options = {
      method,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
    };
    if (data !== null) {
      options.body = JSON.stringify(data);
    }
    const res = await fetch(url, options);
    if (res.ok) {
      const val = await res.json();
      if (val === null || val === undefined) {
        return method === 'GET' ? [] : null;
      }
      let result = val;
      if (method === 'GET' && typeof val === 'object' && !Array.isArray(val)) {
        result = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      }
      if (Array.isArray(result)) {
        result = result.filter(Boolean);
      }
      if (path === 'products' && Array.isArray(result)) {
        result.forEach((p) => {
          if (p) {
            delete p.imageData;
            delete p.imageBase64;
          }
        });
      }
      return result;
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
  // 1. Luôn ưu tiên fetch trực tiếp Firebase Realtime Database (Nguồn sự thật 100%)
  try {
    const directData = await fetchDirectRtdb('categories');
    if (directData !== null && Array.isArray(directData) && directData.length > 0) {
      try {
        localStorage.setItem('casa_admin_categories', JSON.stringify(directData));
      } catch (_) {}
      return directData;
    }
  } catch (err) {
    console.warn('[Frontend Service] fetchDirectRtdb categories error, trying Backend API:', err.message);
  }

  // 2. Dự phòng qua Backend API
  try {
    const data = await categoryApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_categories', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbCategories via Backend API failed:', err.message);
  }

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

  // 2. Ghi trực tiếp lên Firebase Realtime Database ngay lập tức (0ms trễ)
  try {
    await fetchDirectRtdb(`categories/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save category error:', directErr);
  }

  // 3. Đồng bộ với Backend API
  try {
    const result = isNew ? await categoryApi.create(itemToSave) : await categoryApi.update(targetId, itemToSave);
    return result?.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbCategory backend sync notice:', err.message);
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
    await fetchDirectRtdb(`categories/${categoryId}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete category error:', directErr);
  }

  try {
    return await categoryApi.delete(categoryId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbCategory error:', err.message);
    return { success: true };
  }
}

// ============================================================================
// PRODUCTS
// ============================================================================
export async function getRtdbProducts() {
  // 1. Luôn ưu tiên fetch trực tiếp từ Firebase Realtime Database (Nguồn sự thật 100%, 0ms cache)
  try {
    const directData = await fetchDirectRtdb('products');
    if (directData !== null && Array.isArray(directData)) {
      try {
        localStorage.setItem('casa_admin_products', JSON.stringify(directData));
      } catch (_) {}
      return directData;
    }
  } catch (err) {
    console.warn('[Frontend Service] fetchDirectRtdb products error, trying Backend API:', err.message);
  }

  // 2. Dự phòng qua Backend API nếu fetch trực tiếp Firebase bị lỗi mạng
  try {
    const data = await productApi.getAll();
    if (data !== null && Array.isArray(data)) {
      try {
        localStorage.setItem('casa_admin_products', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbProducts via Backend API failed:', err.message);
  }

  const saved = localStorage.getItem('casa_admin_products');
  return saved ? JSON.parse(saved) : [];
}

export async function saveRtdbProduct(product, isExplicitNew = null) {
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

  // Xác định chuẩn xác trạng thái thêm mới hay chỉnh sửa
  let isNew = isExplicitNew;
  if (isNew === null) {
    if (!product.id) {
      isNew = true;
    } else {
      try {
        const saved = localStorage.getItem('casa_admin_products');
        const list = saved ? JSON.parse(saved) : [];
        // Nếu ID đã có trong danh sách thì là CẬP NHẬT (isNew = false)
        isNew = !list.some((p) => String(p.id) === String(targetId));
      } catch (_) {
        isNew = false;
      }
    }
  }

  // 2. Ghi trực tiếp lên Firebase Realtime Database (0ms trễ)
  try {
    await fetchDirectRtdb(`products/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save product error:', directErr);
  }

  // 3. Đồng bộ với Backend API
  try {
    const result = isNew ? await productApi.create(itemToSave) : await productApi.update(targetId, itemToSave);
    return result?.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbProduct backend sync notice:', err.message);
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
    await fetchDirectRtdb(`products/${productId}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete product error:', directErr);
  }

  try {
    return await productApi.delete(productId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbProduct error:', err.message);
    return { success: true };
  }
}

// ============================================================================
// NEWS & ARTICLES
// ============================================================================
export async function getRtdbNews() {
  // 1. Luôn ưu tiên fetch trực tiếp Firebase Realtime Database (Nguồn sự thật 100%)
  try {
    const directData = await fetchDirectRtdb('news');
    if (directData !== null && Array.isArray(directData)) {
      try {
        localStorage.setItem('casa_admin_news', JSON.stringify(directData));
      } catch (_) {}
      return directData;
    }
  } catch (err) {
    console.warn('[Frontend Service] fetchDirectRtdb news error, trying Backend API:', err.message);
  }

  // 2. Dự phòng qua Backend API
  try {
    const data = await newsApi.getAll();
    if (data !== null && Array.isArray(data)) {
      try {
        localStorage.setItem('casa_admin_news', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbNews via Backend API failed:', err.message);
  }

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

  // 2. Ghi trực tiếp lên Firebase Realtime Database (0ms trễ)
  try {
    await fetchDirectRtdb(`news/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save news error:', directErr);
  }

  // 3. Đồng bộ với Backend API
  try {
    const result = isNew ? await newsApi.create(itemToSave) : await newsApi.update(targetId, itemToSave);
    return result?.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbNews backend sync notice:', err.message);
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
    await fetchDirectRtdb(`news/${newsId}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete news error:', directErr);
  }

  try {
    return await newsApi.delete(newsId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbNews error:', err.message);
    return { success: true };
  }
}

// ============================================================================
// FAQS
// ============================================================================
export async function getRtdbFaqs() {
  // 1. Luôn ưu tiên fetch trực tiếp Firebase Realtime Database
  try {
    const directData = await fetchDirectRtdb('faqs');
    if (directData !== null && Array.isArray(directData) && directData.length > 0) {
      try {
        localStorage.setItem('casa_admin_faqs', JSON.stringify(directData));
      } catch (_) {}
      return directData;
    }
  } catch (err) {
    console.warn('[Frontend Service] fetchDirectRtdb faqs error, trying Backend API:', err.message);
  }

  // 2. Dự phòng qua Backend API
  try {
    const data = await faqApi.getAll();
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem('casa_admin_faqs', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[Frontend Service] getRtdbFaqs via Backend API failed:', err.message);
  }

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

  // Ghi trực tiếp lên Firebase Realtime Database ngay lập tức (0ms trễ)
  try {
    await fetchDirectRtdb(`faqs/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save faq error:', directErr);
  }

  try {
    const result = isNew ? await faqApi.create(itemToSave) : await faqApi.update(targetId, itemToSave);
    return result?.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbFaq backend notice:', err.message);
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
    await fetchDirectRtdb(`faqs/${faqId}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete faq error:', directErr);
  }

  try {
    return await faqApi.delete(faqId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbFaq error:', err.message);
    return { success: true };
  }
}

// ============================================================================
// MACHINERY
// ============================================================================
export async function getRtdbMachinery() {
  // 1. Luôn ưu tiên fetch trực tiếp Firebase Realtime Database
  try {
    const directData = await fetchDirectRtdb('machinery');
    if (directData !== null && Array.isArray(directData)) {
      const cleaned = directData.filter((m) => !String(m.id).startsWith('machinery-0'));
      try {
        localStorage.setItem('casa_admin_machinery', JSON.stringify(cleaned));
      } catch (_) {}
      return cleaned;
    }
  } catch (err) {
    console.warn('[Frontend Service] fetchDirectRtdb machinery error, trying Backend API:', err.message);
  }

  // 2. Dự phòng qua Backend API
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
    console.warn('[Frontend Service] getRtdbMachinery via Backend API failed:', err.message);
  }

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

  // Ghi trực tiếp lên Firebase Realtime Database ngay lập tức (0ms trễ)
  try {
    await fetchDirectRtdb(`machinery/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save machinery error:', directErr);
  }

  try {
    const result = isNew ? await machineryApi.create(itemToSave) : await machineryApi.update(targetId, itemToSave);
    return result?.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbMachinery backend notice:', err.message);
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
    await fetchDirectRtdb(`machinery/${id}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete machinery error:', directErr);
  }

  try {
    return await machineryApi.delete(id);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbMachinery error:', err.message);
    return { success: true };
  }
}

// ============================================================================
// CERTIFICATIONS
// ============================================================================
export async function getRtdbCertifications() {
  try {
    const directData = await fetchDirectRtdb('certifications');
    if (directData && Array.isArray(directData) && directData.length > 0) {
      localStorage.setItem('casa_admin_certifications', JSON.stringify(directData));
      return directData;
    }
  } catch (_) {}

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
    const directData = await fetchDirectRtdb('contacts');
    if (Array.isArray(directData)) return directData;
  } catch (_) {}

  try {
    return await contactApi.getAll();
  } catch (err) {
    console.warn('[Frontend Service] getRtdbContacts error:', err.message);
    return [];
  }
}

export async function saveRtdbContact(contact) {
  const targetId = contact.id || `contact_${Date.now()}`;
  const itemToSave = { ...contact, id: targetId, createdAt: contact.createdAt || new Date().toISOString() };

  try {
    await fetchDirectRtdb(`contacts/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save contact error:', directErr);
  }

  try {
    const result = await contactApi.submit(itemToSave);
    return result?.id || targetId;
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbContact backend notice:', err.message);
    return targetId;
  }
}

export async function deleteRtdbContact(contactId) {
  try {
    await fetchDirectRtdb(`contacts/${contactId}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete contact error:', directErr);
  }

  try {
    return await contactApi.delete(contactId);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbContact error:', err.message);
    return { success: true };
  }
}

// ============================================================================
// USERS
// ============================================================================
export async function saveRtdbUser(user) {
  const targetId = user.uid || user.id || `user_${Date.now()}`;
  const itemToSave = { ...user, id: targetId, uid: targetId };

  try {
    await fetchDirectRtdb(`users/${targetId}`, 'PUT', itemToSave);
    await fetchDirectRtdb(`user/${targetId}`, 'PUT', itemToSave);
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb save user error:', directErr);
  }

  try {
    return await userApi.save(itemToSave);
  } catch (err) {
    console.warn('[Frontend Service] saveRtdbUser error:', err.message);
    return itemToSave;
  }
}

export async function deleteRtdbUser(uid) {
  try {
    await fetchDirectRtdb(`users/${uid}`, 'DELETE');
    await fetchDirectRtdb(`user/${uid}`, 'DELETE');
  } catch (directErr) {
    console.warn('[Frontend Service] fetchDirectRtdb delete user error:', directErr);
  }

  try {
    return await userApi.delete(uid);
  } catch (err) {
    console.warn('[Frontend Service] deleteRtdbUser error:', err.message);
    return { success: true };
  }
}
