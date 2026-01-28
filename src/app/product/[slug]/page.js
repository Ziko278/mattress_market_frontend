'use client';

import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/shared/ProductCard';
import { apiService } from '@/lib/api';
import { CURRENCY } from '@/lib/constants';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isInCart, setIsInCart] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);

  

  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    email: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await apiService.getSiteInfo();
        setSiteInfo(response.data);
      } catch (error) {
        console.error('Error fetching site info:', error);
      }
    };
    fetchSiteInfo();
  }, []);

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

  useEffect(() => {
    checkIfInCart();
  }, [selectedVariant]);

  const checkIfInCart = () => {
    if (!selectedVariant) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.some(item => item.variant_id === selectedVariant.id);
    setIsInCart(exists);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a size');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (isInCart) {
      const updatedCart = cart.filter(item => item.variant_id !== selectedVariant.id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setIsInCart(false);
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      const existingIndex = cart.findIndex(
        (item) => item.variant_id === selectedVariant.id
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
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
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      setIsInCart(true);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createReview({
        ...reviewForm,
        product: product.id,
      });
      //alert('Review submitted for approval!');
      setReviewForm({
        customer_name: '',
        email: '',
        rating: 5,
        comment: '',
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      //alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl"></div>
              <div className="space-y-6">
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl w-3/4"></div>
                <div className="h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-1/2"></div>
                <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl w-1/3"></div>
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
        <div className="container mx-auto px-4 md:px-8 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
            <a href="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-900 transition-all duration-300 hover:scale-105">
              Browse Shop
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-primary transition-colors">Home</a>
            <span className="text-gray-400">›</span>
            <a href="/shop" className="text-gray-500 hover:text-primary transition-colors">Shop</a>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden group">
                <img
                  src={product.images[selectedImage]?.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                        selectedImage === index
                          ? 'ring-4 ring-primary shadow-lg scale-105'
                          : 'ring-2 ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand Badge */}
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
                  {product.brand.name}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Category */}
              <div className="flex items-center gap-6">
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-lg">
                      {'★'.repeat(Math.round(product.average_rating))}
                      {'☆'.repeat(5 - Math.round(product.average_rating))}
                    </div>
                    <span className="text-gray-600 text-sm font-medium">
                      {product.average_rating.toFixed(1)} ({product.reviews.length})
                    </span>
                  </div>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {product.category.title}
                </span>
              </div>

              {/* Price */}
              <div className="py-4">
                {selectedVariant ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-primary">
                      {CURRENCY}{Number(selectedVariant.price).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-lg">per unit</span>
                  </div>
                ) : (
                  <div className="text-2xl font-semibold text-gray-400">
                    Select a variant to see price
                  </div>
                )}
              </div>

              {/* Size Selection - Dropdown */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Select Size / Variant
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVariant?.id || ''}
                      onChange={(e) => {
                        const variant = product.variants.find(v => v.id === parseInt(e.target.value));
                        setSelectedVariant(variant);
                      }}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl appearance-none cursor-pointer focus:outline-none focus:border-primary transition-all duration-300 text-base font-medium text-gray-900 hover:border-gray-400"
                    >
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.size_name}
                          {variant.thickness ? ` - ${variant.thickness}` : ''} 
                          {' • '}
                          {CURRENCY}{Number(variant.price).toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Quantity
                </label>
                <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 font-bold text-xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 text-center border-x-2 border-gray-200 focus:outline-none font-semibold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 ${
                    isInCart 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-primary hover:bg-blue-900'
                  } text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3`}
                >
                  <span className="text-2xl">{isInCart ? '🗑️' : '🛒'}</span>
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                {/* <button className="sm:w-auto px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                  <span className="text-xl">❤️</span>
                  <span className="hidden sm:inline">Wishlist</span>
                </button> */}
              </div>

              {/* Contact Options */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Need assistance? We're here to help
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Call */}
                  {siteInfo?.phone && (
                    <a
                      href={`tel:${siteInfo.phone}`}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                      <span className="text-xl">📞</span>
                      <span>Call Us</span>
                    </a>
                  )}

                  {/* WhatsApp */}
                  {siteInfo?.whatsapp && (
                    <a
                      href={`https://wa.me/${siteInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-16">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-5 text-center font-bold transition-all duration-300 relative ${
                      activeTab === tab
                        ? 'text-primary bg-white'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                    }`}
                  >
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                    )}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-12">
              {/* Description Tab */}
              {activeTab === 'description' && (
				  <div className="prose max-w-none">
					<div
					  className="text-gray-700 text-lg leading-relaxed"
					  dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(product.description || '')
					  }}
					/>
				  </div>
				)}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div className="space-y-1">
                  {[
                    { label: 'Brand', value: product.brand.name },
                    { label: 'Category', value: product.category.title },
                    ...(product.weight ? [{ label: 'Weight', value: product.weight.weight }] : []),
                    { label: 'Available Sizes', value: product.variants.map((v) => v.size_name).join(', ') },
                  ].map((spec, index) => (
                    <div
                      key={index}
                      className={`flex py-4 ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                    >
                      <span className="w-1/3 font-bold text-gray-900">{spec.label}</span>
                      <span className="w-2/3 text-gray-700">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Review List */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
                          <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                {review.customer_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900">{review.customer_name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex text-yellow-400 text-sm">
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                  </div>
                                  <span className="text-gray-500 text-sm">
                                    {new Date(review.created_at).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            {review.image && (
                              <img
                                src={review.image}
                                alt="Review"
                                className="mt-4 w-40 h-40 object-cover rounded-xl shadow-md"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-3">📝</div>
                        <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>

                  {/* Review Form */}
                  <div className="border-t-2 border-gray-100 pt-12">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={reviewForm.customer_name}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, customer_name: e.target.value })
                            }
                            required
                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-gray-900"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Email
                          </label>
                          <input
                            type="email"
                            value={reviewForm.email}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, email: e.target.value })
                            }
                            required
                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-gray-900"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className={`text-4xl transition-all duration-200 hover:scale-110 ${
                                star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Your Review
                        </label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, comment: e.target.value })
                          }
                          required
                          rows="5"
                          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-gray-900 resize-none"
                          placeholder="Share your experience with this product..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="bg-primary hover:bg-blue-900 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}