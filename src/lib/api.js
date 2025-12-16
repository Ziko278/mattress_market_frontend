import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// API Methods
export const apiService = {
  // Site Info & Settings
  getSiteInfo: () => api.get('/site-info/'),
  getSettings: () => api.get('/settings/'),
  getSliders: (brandId = null) => api.get(`/sliders/${brandId ? `?brand=${brandId}` : ''}`),

  // Products
  getBrands: () => api.get('/products/brands/'),
  getCategories: () => api.get('/products/categories/'),
  getWeights: () => api.get('/products/weights/'),
  getProducts: (params = {}) => api.get('/products/', { params }),
  getProductDetail: (slug) => api.get(`/products/${slug}/`),
  getFeaturedProducts: () => api.get('/products/featured/'),
  getNewArrivals: () => api.get('/products/new-arrivals/'),
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related/`),
  createReview: (data) => api.post('/products/reviews/create/', data),

  // Orders
  createOrder: (data) => api.post('/orders/create/', data),
  trackOrder: (orderId) => api.get(`/orders/track/?order_id=${orderId}`),
  getUserOrders: () => api.get('/orders/my-orders/'),
  getOrderDetail: (orderId) => api.get(`/orders/${orderId}/`),

  // Wishlist
  getWishlist: () => api.get('/orders/wishlist/'),
  addToWishlist: (productId) => api.post('/orders/wishlist/add/', { product_id: productId }),
  removeFromWishlist: (wishlistId) => api.delete(`/orders/wishlist/${wishlistId}/`),

  // Address
  getAddresses: () => api.get('/orders/addresses/'),
  createAddress: (data) => api.post('/orders/addresses/create/', data),
  updateAddress: (addressId, data) => api.put(`/orders/addresses/${addressId}/`, data),
  deleteAddress: (addressId) => api.delete(`/orders/addresses/${addressId}/delete/`),

  // Blog
  getBlogCategories: () => api.get('/blog/categories/'),
  getBlogPosts: (params = {}) => api.get('/blog/posts/', { params }),
  getBlogPost: (slug) => api.get(`/blog/posts/${slug}/`),
  getRecentPosts: () => api.get('/blog/recent/'),
  createComment: (data) => api.post('/blog/comments/create/', data),

  // Auth
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  logout: () => api.post('/users/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/update/', data),
  changePassword: (data) => api.post('/users/password/change/', data),
};

export default api;