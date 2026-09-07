import { ref, set, get, remove, update } from 'firebase/database';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { rtdb, db } from '../config/firebase.js';

import { PRODUCTS as INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from '../data/products.js';
import { NEWS_ARTICLES as INITIAL_NEWS, NEWS_CATEGORIES } from '../data/news.js';
import { FAQS as INITIAL_FAQS, FAQ_CATEGORIES } from '../data/faq.js';
import { MACHINERY_LIST as INITIAL_MACHINERY, PRODUCTION_STEPS, QC_PILLARS } from '../data/machinery.js';
import { CERTIFICATIONS } from '../data/certifications.js';

const RTDB_BASE_URL = 'https://websitecasa-15d46-default-rtdb.asia-southeast1.firebasedatabase.app';

// REST fallback for Realtime Database
async function restRtdb(path, method = 'GET', data = null) {
  const url = `${RTDB_BASE_URL}/${path}.json`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (data !== null) {
    options.body = JSON.stringify(data);
  }
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[Backend RTDB REST] ${method} ${path} error:`, err?.message || err);
  }
  return null;
}

// In-memory runtime cache/fallback
let memoryStore = {
  products: [...INITIAL_PRODUCTS],
  news: [...INITIAL_NEWS],
  faqs: [...INITIAL_FAQS],
  machinery: [...INITIAL_MACHINERY],
  certifications: [...CERTIFICATIONS],
  contacts: [],
};

// ============================================================================
// PRODUCTS
// ============================================================================
export async function getProducts() {
  try {
    const snap = await get(ref(rtdb, 'products'));
    if (snap.exists()) {
      const val = snap.val();
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      if (list.length > 0) return list;
    }
  } catch (_) {}

  const data = await restRtdb('products');
  if (data && Object.keys(data).length > 0) {
    return Object.keys(data).map((k) => ({ id: k, ...data[k] }));
  }

  return memoryStore.products;
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

export async function saveProduct(product) {
  const cleanId = product.id || `product_${Date.now()}`;
  const record = { ...product, id: cleanId, updatedAt: new Date().toISOString() };
  
  try {
    await set(ref(rtdb, `products/${cleanId}`), record);
  } catch (_) {
    await restRtdb(`products/${cleanId}`, 'PUT', record);
  }

  // Cập nhật memory store
  const idx = memoryStore.products.findIndex((p) => String(p.id) === String(cleanId));
  if (idx >= 0) {
    memoryStore.products[idx] = record;
  } else {
    memoryStore.products.unshift(record);
  }

  return record;
}

export async function deleteProduct(productId) {
  try {
    await remove(ref(rtdb, `products/${productId}`));
  } catch (_) {
    await restRtdb(`products/${productId}`, 'DELETE');
  }
  memoryStore.products = memoryStore.products.filter((p) => String(p.id) !== String(productId));
  return { success: true, id: productId };
}

// ============================================================================
// NEWS & RECIPES
// ============================================================================
export async function getNews() {
  try {
    const snap = await get(ref(rtdb, 'news'));
    if (snap.exists()) {
      const val = snap.val();
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      if (list.length > 0) return list;
    }
  } catch (_) {}

  const data = await restRtdb('news');
  if (data && Object.keys(data).length > 0) {
    return Object.keys(data).map((k) => ({ id: k, ...data[k] }));
  }

  return memoryStore.news;
}

export async function getNewsById(id) {
  const newsList = await getNews();
  return newsList.find((n) => String(n.id) === String(id)) || null;
}

export async function saveNews(newsItem) {
  const cleanId = newsItem.id || `news_${Date.now()}`;
  const record = { ...newsItem, id: cleanId, updatedAt: new Date().toISOString() };
  
  try {
    await set(ref(rtdb, `news/${cleanId}`), record);
  } catch (_) {
    await restRtdb(`news/${cleanId}`, 'PUT', record);
  }

  const idx = memoryStore.news.findIndex((n) => String(n.id) === String(cleanId));
  if (idx >= 0) {
    memoryStore.news[idx] = record;
  } else {
    memoryStore.news.unshift(record);
  }

  return record;
}

export async function deleteNews(newsId) {
  try {
    await remove(ref(rtdb, `news/${newsId}`));
  } catch (_) {
    await restRtdb(`news/${newsId}`, 'DELETE');
  }
  memoryStore.news = memoryStore.news.filter((n) => String(n.id) !== String(newsId));
  return { success: true, id: newsId };
}

// ============================================================================
// FAQS
// ============================================================================
export async function getFaqs() {
  try {
    const snap = await get(ref(rtdb, 'faqs'));
    if (snap.exists()) {
      const val = snap.val();
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      if (list.length > 0) return list;
    }
  } catch (_) {}

  const data = await restRtdb('faqs');
  if (data && Object.keys(data).length > 0) {
    return Object.keys(data).map((k) => ({ id: k, ...data[k] }));
  }

  return memoryStore.faqs;
}

export async function saveFaq(faq) {
  const cleanId = faq.id || `faq_${Date.now()}`;
  const record = { ...faq, id: cleanId, updatedAt: new Date().toISOString() };

  try {
    await set(ref(rtdb, `faqs/${cleanId}`), record);
  } catch (_) {
    await restRtdb(`faqs/${cleanId}`, 'PUT', record);
  }

  const idx = memoryStore.faqs.findIndex((f) => String(f.id) === String(cleanId));
  if (idx >= 0) {
    memoryStore.faqs[idx] = record;
  } else {
    memoryStore.faqs.unshift(record);
  }

  return record;
}

export async function deleteFaq(faqId) {
  try {
    await remove(ref(rtdb, `faqs/${faqId}`));
  } catch (_) {
    await restRtdb(`faqs/${faqId}`, 'DELETE');
  }
  memoryStore.faqs = memoryStore.faqs.filter((f) => String(f.id) !== String(faqId));
  return { success: true, id: faqId };
}

// ============================================================================
// MACHINERY
// ============================================================================
export async function getMachinery() {
  try {
    const snap = await get(ref(rtdb, 'machinery'));
    if (snap.exists()) {
      const val = snap.val();
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      if (list.length > 0) return list;
    }
  } catch (_) {}

  const data = await restRtdb('machinery');
  if (data && Object.keys(data).length > 0) {
    return Object.keys(data).map((k) => ({ id: k, ...data[k] }));
  }

  return memoryStore.machinery;
}

export async function saveMachinery(item) {
  const cleanId = item.id || `mach_${Date.now()}`;
  const record = { ...item, id: cleanId, updatedAt: new Date().toISOString() };

  try {
    await set(ref(rtdb, `machinery/${cleanId}`), record);
  } catch (_) {
    await restRtdb(`machinery/${cleanId}`, 'PUT', record);
  }

  const idx = memoryStore.machinery.findIndex((m) => String(m.id) === String(cleanId));
  if (idx >= 0) {
    memoryStore.machinery[idx] = record;
  } else {
    memoryStore.machinery.unshift(record);
  }

  return record;
}

export async function deleteMachinery(id) {
  try {
    await remove(ref(rtdb, `machinery/${id}`));
  } catch (_) {
    await restRtdb(`machinery/${id}`, 'DELETE');
  }
  memoryStore.machinery = memoryStore.machinery.filter((m) => String(m.id) !== String(id));
  return { success: true, id };
}

// ============================================================================
// CERTIFICATIONS
// ============================================================================
export async function getCertifications() {
  return CERTIFICATIONS;
}

// ============================================================================
// CONTACTS
// ============================================================================
export async function getContacts() {
  try {
    const snap = await get(ref(rtdb, 'contacts'));
    if (snap.exists()) {
      const val = snap.val();
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      if (list.length > 0) return list;
    }
  } catch (_) {}

  const data = await restRtdb('contacts');
  if (data && Object.keys(data).length > 0) {
    return Object.keys(data).map((k) => ({ id: k, ...data[k] }));
  }

  return memoryStore.contacts;
}

export async function saveContact(contact) {
  const cleanId = contact.id || `contact_${Date.now()}`;
  const record = {
    ...contact,
    id: cleanId,
    status: contact.status || 'NEW',
    createdAt: contact.createdAt || new Date().toISOString()
  };

  try {
    await set(ref(rtdb, `contacts/${cleanId}`), record);
  } catch (_) {
    await restRtdb(`contacts/${cleanId}`, 'PUT', record);
  }

  const idx = memoryStore.contacts.findIndex((c) => String(c.id) === String(cleanId));
  if (idx >= 0) {
    memoryStore.contacts[idx] = record;
  } else {
    memoryStore.contacts.unshift(record);
  }

  return record;
}

export async function updateContactStatus(contactId, status) {
  try {
    await update(ref(rtdb, `contacts/${contactId}`), { status });
  } catch (_) {
    await restRtdb(`contacts/${contactId}`, 'PATCH', { status });
  }

  const c = memoryStore.contacts.find((x) => String(x.id) === String(contactId));
  if (c) c.status = status;

  return { success: true, id: contactId, status };
}

export async function deleteContact(contactId) {
  try {
    await remove(ref(rtdb, `contacts/${contactId}`));
  } catch (_) {
    await restRtdb(`contacts/${contactId}`, 'DELETE');
  }
  memoryStore.contacts = memoryStore.contacts.filter((c) => String(c.id) !== String(contactId));
  return { success: true, id: contactId };
}

// ============================================================================
// USERS
// ============================================================================
export async function saveUser(user) {
  const cleanUid = user.uid || `user_${Date.now()}`;
  const record = { ...user, uid: cleanUid, updatedAt: new Date().toISOString() };
  try {
    await set(ref(rtdb, `users/${cleanUid}`), record);
  } catch (_) {
    await restRtdb(`users/${cleanUid}`, 'PUT', record);
  }
  return record;
}

export async function deleteUser(uid) {
  try {
    await remove(ref(rtdb, `users/${uid}`));
  } catch (_) {
    await restRtdb(`users/${uid}`, 'DELETE');
  }
  return { success: true, uid };
}
