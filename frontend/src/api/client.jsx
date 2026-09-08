// ============================================================================
// CASA TEA - FRONTEND API CLIENT
// Giao tiếp trực tiếp với Backend REST API Server (/api/...)
// ============================================================================

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[API Client] ${options.method || 'GET'} ${endpoint} error:`, err.message);
    throw err;
  }
}

// ----------------------------------------------------------------------------
// PRODUCTS API
// ----------------------------------------------------------------------------
export const productApi = {
  getAll: () => request('/products'),
  getById: (id) => request(`/products/${id}`),
  create: (data) => request('/products', { method: 'POST', body: data }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// PRODUCT CATEGORIES API
// ----------------------------------------------------------------------------
export const categoryApi = {
  getAll: () => request('/categories'),
  getById: (id) => request(`/categories/${id}`),
  create: (data) => request('/categories', { method: 'POST', body: data }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// NEWS & ARTICLES API
// ----------------------------------------------------------------------------
export const newsApi = {
  getAll: () => request('/news'),
  getById: (id) => request(`/news/${id}`),
  create: (data) => request('/news', { method: 'POST', body: data }),
  update: (id, data) => request(`/news/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/news/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// FAQS API
// ----------------------------------------------------------------------------
export const faqApi = {
  getAll: () => request('/faq'),
  create: (data) => request('/faq', { method: 'POST', body: data }),
  update: (id, data) => request(`/faq/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/faq/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// MACHINERY API
// ----------------------------------------------------------------------------
export const machineryApi = {
  getAll: () => request('/machinery'),
  create: (data) => request('/machinery', { method: 'POST', body: data }),
  update: (id, data) => request(`/machinery/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/machinery/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// CERTIFICATIONS API
// ----------------------------------------------------------------------------
export const certificationApi = {
  getAll: () => request('/certifications'),
};

// ----------------------------------------------------------------------------
// CONTACTS API
// ----------------------------------------------------------------------------
export const contactApi = {
  getAll: () => request('/contacts'),
  submit: (data) => request('/contacts', { method: 'POST', body: data }),
  updateStatus: (id, status) => request(`/contacts/${id}/status`, { method: 'PATCH', body: { status } }),
  delete: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// AI SERVICES API (GEMINI SERVER-SIDE)
// ----------------------------------------------------------------------------
export const aiApi = {
  designProduct: (data) => request('/ai/design-product', { method: 'POST', body: data }),
  rewriteDesc: (data) => request('/ai/rewrite-desc', { method: 'POST', body: data }),
  designNews: (data) => request('/ai/design-news', { method: 'POST', body: data }),
  translateProductZh: (data) => request('/ai/translate-product-zh', { method: 'POST', body: data }),
  translateNewsZh: (data) => request('/ai/translate-news-zh', { method: 'POST', body: data }),
  translateFaqZh: (data) => request('/ai/translate-faq-zh', { method: 'POST', body: data }),
  translateMachineryZh: (data) => request('/ai/translate-machinery-zh', { method: 'POST', body: data }),
  translateCategoryZh: (data) => request('/ai/translate-category-zh', { method: 'POST', body: data }),
};

// ----------------------------------------------------------------------------
// USERS API
// ----------------------------------------------------------------------------
export const userApi = {
  save: (data) => request('/users', { method: 'POST', body: data }),
  delete: (uid) => request(`/users/${uid}`, { method: 'DELETE' }),
};

export default {
  products: productApi,
  categories: categoryApi,
  category: categoryApi,
  news: newsApi,
  faq: faqApi,
  machinery: machineryApi,
  certifications: certificationApi,
  contacts: contactApi,
  ai: aiApi,
  users: userApi,
};
