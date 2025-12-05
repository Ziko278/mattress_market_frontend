// app/product/[slug]/page.js

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/shared/ProductCard';
import { apiService } from '@/lib/api'; // Assuming this has the fetch logic
// 💡 FIX: Import Constants directly
import { API_BASE_URL, CURRENCY } from '@/lib/constants'; // Assuming constants.js is in '@/lib/constants'

// ------------------------------------------------------------------
// 💡 REQUIRED FIX FOR BUILD ERROR (generateStaticParams)
// ------------------------------------------------------------------

// 1. Define the server-side logic needed to fetch all slugs.
const getProductSlugs = async () => {
  try {
    // 💡 FIX: Use the imported API_BASE_URL for a raw fetch if apiService causes issues,
    // or rely on apiService.getProductsList() if it works on the server.
    // For reliability in static exports, we often use a direct fetch here:
    const response = await fetch(`${API_BASE_URL}/products/`); 
    if (!response.ok) {
        throw new Error(`Failed to fetch product list: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Assuming the API returns an array of objects, each containing a 'slug' field.
    return data.map(product => ({
      slug: product.slug, 
    }));
  } catch (error) {
    console.error('Failed to fetch product slugs for static generation:', error);
    // Return an empty array to gracefully handle the build if products can't be fetched
    return [];
  }
};

/**
 * Next.js function required for dynamic routes with static export ('output: export').
 * It pre-renders the paths for all product detail pages.
 */
export async function generateStaticParams() {
    const slugs = await getProductSlugs();
    // Logging for build debugging
    console.log(`Generated ${slugs.length} static paths for products.`); 
    return slugs;
}


// ------------------------------------------------------------------
// Client Component Code (ProductDetailPage)
// ------------------------------------------------------------------

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // 💡 NEW: Unified state for notifications
  const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'danger' | 'warning' }
  const [isCartActionLoading, setIsCartActionLoading] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    email: '',
    rating: 5,
    comment: '',
  });
  
  // 💡 NEW: Helper function for unified notification display
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  // Effect to hide notification after a few seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiService.getProductDetail(params.slug);
        setProduct(response.data);

        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }

        const relatedRes = await apiService.getRelatedProducts(response.data.id);
        setRelatedProducts(relatedRes.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]); 

  // 💡 MODIFIED: Helper function to check if a variant is in the cart
  const isVariantInCart = useCallback(() => {
    if (!selectedVariant) return false;
    // Client-side logic for cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.some(item => item.variant_id === selectedVariant.id);
  }, [selectedVariant]);

  // 💡 MODIFIED: Combined handler for adding/removing from cart
  const handleCartAction = () => {
    if (!selectedVariant) {
      showNotification('Please select a variant first.', 'warning');
      return;
    }
    
    setIsCartActionLoading(true);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(
      (item) => item.variant_id === selectedVariant.id
    );

    if (existingIndex > -1) {
      // Remove item from cart
      const newCart = cart.filter(item => item.variant_id !== selectedVariant.id);
      localStorage.setItem('cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('cartUpdated'));
      showNotification('Item removed from cart.', 'success');
    } else {
      // Add new item
      cart.push({
        variant_id: selectedVariant.id,
        product_id: product.id,
        product_name: product.name,
        brand: product.brand.name,
        size: selectedVariant.size_name,
        price: selectedVariant.price,
        quantity: quantity,
        image: product.images[0]?.image || null,
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      showNotification('Added to cart!', 'success');
    }
    
    setIsCartActionLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsReviewSubmitting(true);
    
    try {
      await apiService.createReview({
        ...reviewForm,
        product: product.id,
      });
      showNotification('Review submitted for approval!', 'success');
      setReviewForm({ customer_name: '', email: '', rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotification('Failed to submit review.', 'danger');
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        {/* Simplified and consistent placeholder styles */}
        <div className="container py-5">
          <div className="placeholder-glow">
            <div className="row g-4">
              <div className="col-lg-6"><div className="placeholder rounded-3" style={{ height: '500px' }}></div></div>
              <div className="col-lg-6">
                <div className="placeholder-lg p-3 mb-3 bg-gray-200 rounded"></div>
                <div className="placeholder p-1 mb-2 w-75 bg-gray-200 rounded"></div>
                <div className="placeholder p-1 mb-4 w-50 bg-gray-200 rounded"></div>
                <div className="placeholder p-4 mb-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h1 className="mb-4">Product Not Found</h1>
          <a href="/shop" className="btn btn-primary">Back to Shop</a>
        </div>
      </Layout>
    );
  }

  const inCart = isVariantInCart();

  return (
    <Layout>
      {/* 💡 NEW: Notification Display using unified state */}
      {notification && (
        <div className={`container py-2`}>
          <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
            {notification.message}
            <button type="button" className="btn-close" onClick={() => setNotification(null)} aria-label="Close"></button>
          </div>
        </div>
      )}

      {/* Breadcrumb - Keep this clean */}
      <div className="page-title">
        <div className="container">
          <nav className="d-flex justify-content-between">
            <h1>{product.name}</h1>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/shop">Shop</a></li>
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Product Details Section */}
          <div className="col-lg-6">
            {/* Image Gallery component could go here */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-0">
                {/* Main Image */}
                <div className="ratio ratio-1x1">
                  <img
                    src={product.images[selectedImage]?.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="img-fluid object-fit-cover rounded-top"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="d-flex gap-2 p-3 overflow-auto">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 border-2 rounded p-1 ${
                          selectedImage === index ? 'border-primary' : 'border-secondary'
                        }`}
                        style={{ background: 'white' }} 
                      >
                        <img
                          src={img.image}
                          alt={`${product.name} ${index + 1}`}
                          className="img-fluid"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                {/* Brand and Name */}
                <p className="text-uppercase text-muted small mb-2">{product.brand.name}</p>
                <h2 className="card-title fw-bold mb-3">{product.name}</h2>
                <p className="mb-3">Category: <span className="fw-semibold">{product.category.title}</span></p>

                {/* Rating */}
                {product.average_rating > 0 && (
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="text-warning">
                      {'★'.repeat(Math.round(product.average_rating))}
                      {'☆'.repeat(5 - Math.round(product.average_rating))}
                    </div>
                    <span className="text-muted">({product.reviews.length} reviews)</span>
                  </div>
                )}
                
                {/* Price */}
                <div className="mb-4">
                  {selectedVariant ? (
                    <h3 className="text-primary">{CURRENCY}{Number(selectedVariant.price).toLocaleString()}</h3>
                  ) : (
                    <h3 className="text-muted">Select a variant to see price</h3>
                  )}
                </div>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <label htmlFor="variantSelect" className="form-label fw-semibold">Select Variant</label>
                    <select
                      id="variantSelect"
                      value={selectedVariant?.id || ''}
                      onChange={(e) => {
                        const variant = product.variants.find(v => v.id === parseInt(e.target.value));
                        setSelectedVariant(variant);
                        setQuantity(1); // Reset quantity on variant change for cleaner UX
                      }}
                      className="form-select"
                    >
                      {/* Optional: Add a placeholder option if needed */}
                      {!selectedVariant && <option value="" disabled>Choose a size...</option>}
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.size_name} - {CURRENCY}{Number(variant.price).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-4">
                  <label htmlFor="quantityInput" className="form-label fw-semibold">Quantity</label>
                  <div className="input-group" style={{ width: '150px' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn btn-outline-secondary" type="button" disabled={quantity <= 1}>-</button>
                    <input 
                      id="quantityInput" 
                      type="number" 
                      min="1"
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                      className="form-control text-center" 
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className="btn btn-outline-secondary" type="button">+</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex mb-4">
                  <button
                    onClick={handleCartAction}
                    className={`btn flex-grow-1 ${inCart ? 'btn-danger' : 'btn-primary'}`}
                    disabled={!selectedVariant || isCartActionLoading}
                  >
                    {isCartActionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {inCart ? 'Removing...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <i className={`bi ${inCart ? 'bi-cart-dash' : 'bi-cart-plus'} me-2`}></i>
                        {inCart ? 'Remove from Cart' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-heart me-2"></i> Wishlist
                  </button>
                </div>

                {/* Contact Options */}
                <div className="border-top pt-4">
                  <p className="text-muted mb-3">Need help? Contact us:</p>
                  <div className="d-grid gap-2 d-md-flex">
                    <a href="tel:+2348012345678" className="btn btn-outline-dark flex-grow-1">
                      <i className="bi bi-telephone-fill me-2"></i> Call
                    </a>
                    <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="btn btn-success flex-grow-1">
                      <i className="bi bi-whatsapp me-2"></i> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              {/* Tab Headers */}
              <ul className="nav nav-tabs" role="tablist">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <li className="nav-item" role="presentation" key={tab}>
                    <button 
                      className={`nav-link ${activeTab === tab ? 'active' : ''}`} 
                      onClick={() => setActiveTab(tab)} 
                      type="button" 
                      role="tab"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'reviews' ? product.reviews.length : ''})
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab Content */}
              <div className="card-body">
                {/* Description Tab */}
                {activeTab === 'description' && <div className="tab-pane fade show active"><p className="lead">{product.description}</p></div>}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div className="tab-pane fade show active">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between"><span className="fw-semibold">Brand:</span><span>{product.brand.name}</span></li>
                      <li className="list-group-item d-flex justify-content-between"><span className="fw-semibold">Category:</span><span>{product.category.title}</span></li>
                      {product.weight && <li className="list-group-item d-flex justify-content-between"><span className="fw-semibold">Weight:</span><span>{product.weight.weight}</span></li>}
                      <li className="list-group-item d-flex justify-content-between"><span className="fw-semibold">Available Sizes:</span><span>{product.variants.map((v) => v.size_name).join(', ')}</span></li>
                    </ul>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="tab-pane fade show active">
                    <h4 className="mb-4">Customer Reviews</h4>
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="mb-5">{product.reviews.map((review) => (
                        <div key={review.id} className="border-bottom pb-3 mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">{review.customer_name}</span>
                            <div className="text-warning">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                          </div>
                          <p className="mb-2">{review.comment}</p>
                          {review.image && <img src={review.image} alt="Review" className="img-thumbnail mb-2" style={{ maxWidth: '150px' }} />}
                          <p className="text-muted small mb-0">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}</div>
                    ) : (
                      <p className="text-muted">No reviews yet. Be the first to review!</p>
                    )}

                    <hr />
                    <h4 className="mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="reviewName" className="form-label">Your Name</label>
                        <input id="reviewName" type="text" value={reviewForm.customer_name} onChange={(e) => setReviewForm({ ...reviewForm, customer_name: e.target.value })} required className="form-control" />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="reviewEmail" className="form-label">Email</label>
                        <input id="reviewEmail" type="email" value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })} required className="form-control" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Rating</label>
                        <div className="d-flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            // 💡 Improved Rating UX using Bootstrap Icons and color change on hover
                            <i 
                              key={star} 
                              className={`bi bi-star${star <= reviewForm.rating ? '-fill text-warning' : ''}`}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })} 
                              style={{ cursor: 'pointer', fontSize: '1.25rem', transition: 'color 0.2s' }}
                              role="button"
                              aria-label={`Rate ${star} stars`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="reviewComment" className="form-label">Your Review</label>
                        <textarea id="reviewComment" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required rows="4" className="form-control"></textarea>
                      </div>
                      <div className="col-12">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={isReviewSubmitting}
                        >
                          {isReviewSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Submitting...
                            </>
                          ) : 'Submit Review'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-4">Related Products</h3>
            <div className="row g-4">
              {relatedProducts.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}