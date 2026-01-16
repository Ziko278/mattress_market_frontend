import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance for admin
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminApiService = {
  // ==================== AUTH ====================
  login: (credentials) => adminApi.post('/users/login/', credentials),
  logout: () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  },

  // ==================== DASHBOARD ====================
  getDashboardStats: () => adminApi.get('/orders/admin/dashboard/'),

  // ==================== BLOG ====================
  // Categories
  getBlogCategories: () => adminApi.get('/blog/admin/categories/'),
  createBlogCategory: (data) => adminApi.post('/blog/admin/categories/', data),
  updateBlogCategory: (id, data) => adminApi.put(`/blog/admin/categories/${id}/`, data),
  deleteBlogCategory: (id) => adminApi.delete(`/blog/admin/categories/${id}/`),

  // Tags
  getBlogTags: () => adminApi.get('/blog/admin/tags/'),
  createBlogTag: (data) => adminApi.post('/blog/admin/tags/', data),
  updateBlogTag: (id, data) => adminApi.put(`/blog/admin/tags/${id}/`, data),
  deleteBlogTag: (id) => adminApi.delete(`/blog/admin/tags/${id}/`),

  // Posts
  getBlogPosts: (params = {}) => adminApi.get('/blog/admin/posts/', { params }),
  getBlogPost: (id) => adminApi.get(`/blog/admin/posts/${id}/`),
   createBlogPost: (data) => {
      return adminApi.post('/blog/admin/posts/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
  updateBlogPost: (id, data) => {
  return adminApi.put(`/blog/admin/posts/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
    },
  deleteBlogPost: (id) => adminApi.delete(`/blog/admin/posts/${id}/`),

  // Comments
  getBlogComments: (params = {}) => adminApi.get('/blog/admin/comments/', { params }),
  approveComment: (id) => adminApi.post(`/blog/admin/comments/${id}/approve/`),
  deleteComment: (id) => adminApi.delete(`/blog/admin/comments/${id}/`),

  // ==================== PRODUCTS ====================
  // Brands
  getBrands: () => adminApi.get('/products/admin/brands/'),
  getBrand: (id) => adminApi.get(`/products/admin/brands/${id}/`),
  createBrand: (data) => adminApi.post('/products/admin/brands/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBrand: (id, data) => adminApi.put(`/products/admin/brands/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteBrand: (id) => adminApi.delete(`/products/admin/brands/${id}/`),

  // Categories
  getProductCategories: () => adminApi.get('/products/admin/categories/'),
  getProductCategory: (id) => adminApi.get(`/products/admin/categories/${id}/`),
  createProductCategory: (data) => adminApi.post('/products/admin/categories/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProductCategory: (id, data) => adminApi.put(`/products/admin/categories/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProductCategory: (id) => adminApi.delete(`/products/admin/categories/${id}/`),

  // Sizes & Weights
  getSizes: () => adminApi.get('/products/admin/sizes/'),
  createSize: (data) => adminApi.post('/products/admin/sizes/', data),
  getWeights: () => adminApi.get('/products/admin/weights/'),
  createWeight: (data) => adminApi.post('/products/admin/weights/', data),

  // Products
  getProducts: (params = {}) => adminApi.get('/products/admin/products/', { params }),
  getProduct: (id) => adminApi.get(`/products/admin/products/${id}/`),
  createProduct: (data) => adminApi.post('/products/admin/products/', data),
  updateProduct: (id, data) => adminApi.put(`/products/admin/products/${id}/`, data),
  deleteProduct: (id) => adminApi.delete(`/products/admin/products/${id}/`),

  // Variants
  createVariant: (data) => adminApi.post('/products/admin/variants/', data),
  updateVariant: (id, data) => adminApi.put(`/products/admin/variants/${id}/`, data),
  deleteVariant: (id) => adminApi.delete(`/products/admin/variants/${id}/`),

  // Images
  uploadProductImage: (data) => adminApi.post('/products/admin/images/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProductImage: (id) => adminApi.delete(`/products/admin/images/${id}/`),

  // Reviews
  getReviews: (params = {}) => adminApi.get('/products/admin/reviews/', { params }),
  approveReview: (id) => adminApi.post(`/products/admin/reviews/${id}/approve/`),
  deleteReview: (id) => adminApi.delete(`/products/admin/reviews/${id}/`),

  // ==================== ORDERS ====================
  getOrders: (params = {}) => adminApi.get('/orders/admin/orders/', { params }),
  getOrder: (id) => adminApi.get(`/orders/admin/orders/${id}/`),
  updateOrderStatus: (id, status) => adminApi.put(`/orders/admin/orders/${id}/status/`, { status }),
  deleteOrder: (id) => adminApi.delete(`/orders/admin/orders/${id}/delete/`),

  // ==================== CUSTOMERS ====================
  getCustomers: (params = {}) => adminApi.get('/users/admin/users/', { params }),
  getCustomer: (id) => adminApi.get(`/users/admin/users/${id}/`),
  toggleCustomerStatus: (id) => adminApi.post(`/users/admin/users/${id}/toggle/`),
  deleteCustomer: (id) => adminApi.delete(`/users/admin/users/${id}/delete/`),

  // ==================== SITE CONFIG ====================
  getSiteInfo: () => adminApi.get('/site-config/admin/site-info/'),
  updateSiteInfo: (data) => adminApi.put('/site-config/admin/site-info/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  getSettings: () => adminApi.get('/site-config/admin/settings/'),
  updateSettings: (data) => adminApi.put('/site-config/admin/settings/', data),

  getSliders: () => adminApi.get('/site-config/admin/sliders/'),
  getSlider: (id) => adminApi.get(`/site-config/admin/sliders/${id}/`),
  createSlider: (data) => adminApi.post('/site-config/admin/sliders/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSlider: (id, data) => adminApi.put(`/site-config/admin/sliders/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteSlider: (id) => adminApi.delete(`/site-config/admin/sliders/${id}/`),
  toggleSlider: (id) => adminApi.post(`/site-config/admin/sliders/${id}/toggle/`),

  // ==================== BULK PRICE UPDATE ====================
  // Export products to Excel
  exportProductPrices: async () => {
    try {
      const response = await adminApi.get('/products/admin/products/');
      const products = response.data;

      // Flatten variants for Excel export
      const excelData = [];
      products.forEach(product => {
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach(variant => {
            excelData.push({
              variant_id: variant.id,
              product_name: product.name,
              brand: product.brand?.name || '',
              size: variant.size_name || '',
              thickness: variant.thickness || '',
              current_price: variant.price
            });
          });
        }
      });

      return excelData;
    } catch (error) {
      console.error('Error exporting product prices:', error);
      throw error;
    }
  },

  // Import and update prices from Excel
  bulkUpdatePrices: async (priceUpdates) => {
    try {
      // priceUpdates is an array of {variant_id, new_price}
      const updatePromises = priceUpdates.map(update =>
        adminApi.put(`/products/admin/variants/${update.variant_id}/`, {
          price: update.new_price
        })
      );

      const results = await Promise.allSettled(updatePromises);

      const summary = {
        total: results.length,
        success: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        errors: results
          .filter(r => r.status === 'rejected')
          .map(r => r.reason?.response?.data || r.reason?.message)
      };

      return summary;
    } catch (error) {
      console.error('Error bulk updating prices:', error);
      throw error;
    }
  }
};

export default adminApi;