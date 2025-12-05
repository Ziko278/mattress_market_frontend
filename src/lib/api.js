// lib/api.js
// SSR-safe axios wrapper. Use setAuthToken() after login and initAuthFromLocalStorage() on client start.

import axios from 'axios';
import { API_BASE_URL } from './constants';

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Module-scoped auth token (NO direct localStorage access in interceptors)
let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function initAuthFromLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  } catch (e) {
    // ignore localStorage errors (privacy modes)
  }
}

// Try auto-init on client (safe because of the window check)
if (typeof window !== 'undefined') {
  try {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  } catch (e) {}
}

// Attach authToken to every request (reads module-scoped authToken, not localStorage)
api.interceptors.request.use(
  (config) => {
    if (!config.headers) config.headers = {};
    if (authToken) config.headers.Authorization = `Token ${authToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional global response handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      authToken = null;
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('token'); } catch (e) {}
      }
    }
    return Promise.reject(error);
  }
);

// API methods (same as before)
export const apiService = {
  getSiteInfo: () => api.get('/site-info/'),
  getSettings: () => api.get('/settings/'),
  getSliders: (brandId = null) => api.get('/sliders/', { params: brandId ? { brand: brandId } : {} }),

  getBrands: () => api.get('/products/brands/'),
  getCategories: () => api.get('/products/categories/'),
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProductDetail: (slug) => api.get(`/products/${encodeURIComponent(slug)}/`),
  getFeaturedProducts: () => api.get('/products/featured/'),
  getNewArrivals: () => api.get('/products/new-arrivals/'),
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related/`),
  createReview: (data) => api.post('/products/reviews/create/', data),

  createOrder: (data) => api.post('/orders/create/', data),
  trackOrder: (orderId) => api.get('/orders/track/', { params: { order_id: orderId } }),
  getUserOrders: () => api.get('/orders/my-orders/'),
  getOrderDetail: (orderId) => api.get(`/orders/${orderId}/`),

  getWishlist: () => api.get('/orders/wishlist/'),
  addToWishlist: (productId) => api.post('/orders/wishlist/add/', { product_id: productId }),
  removeFromWishlist: (wishlistId) => api.delete(`/orders/wishlist/${wishlistId}/`),

  getAddresses: () => api.get('/orders/addresses/'),
  createAddress: (data) => api.post('/orders/addresses/create/', data),
  updateAddress: (addressId, data) => api.put(`/orders/addresses/${addressId}/`, data),
  deleteAddress: (addressId) => api.delete(`/orders/addresses/${addressId}/delete/`),

  getBlogCategories: () => api.get('/blog/categories/'),
  getBlogPosts: (params = {}) => api.get('/blog/posts/', { params }),
  getBlogPost: (slug) => api.get(`/blog/posts/${slug}/`),
  getRecentPosts: () => api.get('/blog/recent/'),
  createComment: (data) => api.post('/blog/comments/create/', data),

  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  logout: () => api.post('/users/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/update/', data),
  changePassword: (data) => api.post('/users/password/change/', data),
};

export default apiService;
