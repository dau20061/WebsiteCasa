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

// Initial categories seed
const INITIAL_CATEGORIES = [
  {
    id: 'tra-den',
    name: 'Trà Đen (Black Tea)',
    nameZh: '阿薩姆與特選紅茶',
    slug: 'tra-den',
    order: 1,
    desc: 'Các dòng trà đen đậm đà chuyên dụng cho pha chế trà sữa truyền thống, hồng trà kem cheese',
    descZh: '專業濃郁紅茶系列，適用於傳統奶茶、芝士奶蓋紅茶',
    active: true
  },
  {
    id: 'tra-oolong',
    name: 'Trà Ô Long (Oolong)',
    nameZh: '高山炭焙烏龍茶',
    slug: 'tra-oolong',
    order: 2,
    desc: 'Trà Ô Long rang mộc hương thơm khói sâu lắng, hậu vị ngọt kéo dài',
    descZh: '碳焙烏龍茶，沉穩炭焙香氣，喉韻回甘綿長',
    active: true
  },
  {
    id: 'tra-lai-xanh',
    name: 'Trà Lài & Trà Xanh',
    nameZh: '茉莉窨花與特級綠茶',
    slug: 'tra-lai-xanh',
    order: 3,
    desc: 'Hương hoa lài thanh khiết ướp tự nhiên, nền trà xanh tươi mát cho trà sữa lài và trà trái cây',
    descZh: '天然鮮花窨製茉莉花茶，清爽綠茶茶底',
    active: true
  },
  {
    id: 'tra-rang',
    name: 'Trà Rang & Hojicha',
    nameZh: '日式焙茶與煎茶',
    slug: 'tra-rang',
    order: 4,
    desc: 'Công nghệ sao rang nhiệt sâu chuẩn phong cách Nhật Bản, ít chát, hương thơm ấm áp',
    descZh: '日式深層烘焙工藝，低單寧酸，溫潤焦香',
    active: true
  },
  {
    id: 'tra-trai-cay',
    name: 'Nền Trà Trái Cây',
    nameZh: '清爽果茶專用茶底',
    slug: 'tra-trai-cay',
    order: 5,
    desc: 'Nền cốt trà sáng trong, tôn vinh trọn vẹn hương vị của đào, dâu, xoài, mãng cầu và chanh leo',
    descZh: '透亮清澈茶湯，完美襯托蜜桃、草莓、百香果等鮮果風味',
    active: true
  },
  {
    id: 'bot-pha-che',
    name: 'Bột Pha Chế & Topping',
    nameZh: '特級植脂末與配料',
    slug: 'bot-pha-che',
    order: 6,
    desc: 'Bột béo thực vật không sữa Non-dairy Creamer, bột matcha, thạch và topping F&B cao cấp',
    descZh: '特級非乳脂奶精粉、宇治抹茶粉、晶球及高端調飲配料',
    active: true
  }
];

// In-memory runtime cache/fallback
let memoryStore = {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
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

// ============================================================================
// PRODUCT CATEGORIES (CRUD)
// ============================================================================
export async function getCategories() {
  try {
    const snap = await get(ref(rtdb, 'categories'));
    if (snap.exists()) {
      const val = snap.val();
      const list = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      if (list.length > 0) {
        return list.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
      }
    }
  } catch (_) {}

  const data = await restRtdb('categories');
  if (data && Object.keys(data).length > 0) {
    const list = Object.keys(data).map((k) => ({ id: k, ...data[k] }));
    return list.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  }

  return [...memoryStore.categories].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
}

export async function getCategoryById(id) {
  const categories = await getCategories();
  return categories.find((c) => String(c.id) === String(id) || String(c.slug) === String(id)) || null;
}

export async function saveCategory(category) {
  const cleanId = category.id || category.slug || `cat_${Date.now()}`;
  const record = {
    ...category,
    id: cleanId,
    slug: category.slug || cleanId,
    order: Number(category.order) || 1,
    active: category.active !== false,
    updatedAt: new Date().toISOString()
  };

  try {
    await set(ref(rtdb, `categories/${cleanId}`), record);
  } catch (_) {
    await restRtdb(`categories/${cleanId}`, 'PUT', record);
  }

  const idx = memoryStore.categories.findIndex((c) => String(c.id) === String(cleanId));
  if (idx >= 0) {
    memoryStore.categories[idx] = record;
  } else {
    memoryStore.categories.push(record);
  }

  return record;
}

export async function deleteCategory(categoryId) {
  try {
    await remove(ref(rtdb, `categories/${categoryId}`));
  } catch (_) {
    await restRtdb(`categories/${categoryId}`, 'DELETE');
  }

  memoryStore.categories = memoryStore.categories.filter((c) => String(c.id) !== String(categoryId));
  return { success: true, id: categoryId };
}

