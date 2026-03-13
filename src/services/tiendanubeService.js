import { TIENDANUBE_CONFIG, API_HEADERS } from '../config/constants.js'

const { STORE_ID, BASE_URL } = TIENDANUBE_CONFIG

const buildUrl = (endpoint) => `${BASE_URL}/v1/${STORE_ID}${endpoint}`

const makeRequest = async (endpoint, options = {}) => {
  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers: {
      ...API_HEADERS,
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export const tiendanubeService = {
  products: {
    getAll: () => makeRequest('/products'),
    getById: (id) => makeRequest(`/products/${id}`)
  },

  categories: {
    getAll: () => makeRequest('/categories'),
    getById: (id) => makeRequest(`/categories/${id}`)
  },

  coupons: {
    create: (data) => makeRequest('/coupons', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => makeRequest('/coupons'),
    getById: (id) => makeRequest(`/coupons/${id}`),
    update: (id, data) => makeRequest(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => makeRequest(`/coupons/${id}`, { method: 'DELETE' })
  },

  discounts: {
    create: (data) => makeRequest('/discounts', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => makeRequest('/discounts'),
    getById: (id) => makeRequest(`/discounts/${id}`),
    update: (id, data) => makeRequest(`/discounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => makeRequest(`/discounts/${id}`, { method: 'DELETE' })
  },

  orders: {
    create: (data) => makeRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => makeRequest('/orders'),
    getById: (id) => makeRequest(`/orders/${id}`),
    update: (id, data) => makeRequest(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => makeRequest(`/orders/${id}`, { method: 'DELETE' })
  }
}

export default tiendanubeService
