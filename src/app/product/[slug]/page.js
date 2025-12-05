'use client';

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

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    email: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiService.getProductDetail(params.slug);
        setProduct(response.data);
        
        // Set first variant as selected
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }

        // Fetch related products
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

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a size');
      return;
    }

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingIndex = cart.findIndex(
      (item) => item.variant_id === selectedVariant.id
    );

    if (existingIndex > -1) {
      // Update quantity
      cart[existingIndex].quantity += quantity;
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
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in header (trigger re-render)
    window.dispatchEvent(new Event('cartUpdated'));
    
    alert('Added to cart!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createReview({
        ...reviewForm,
        product: product.id,
      });
      alert('Review submitted for approval!');
      setReviewForm({
        customer_name: '',
        email: '',
        rating: 5,
        comment: '',
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
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
        <div className="container mx-auto px-6 md:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <a href="/shop" className="text-primary hover:underline">
            Back to Shop
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-primary transition-colors duration-300">Home</a>
            <span className="mx-2">/</span>
            <a href="/shop" className="hover:text-primary transition-colors duration-300">Shop</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={product.images[selectedImage]?.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index
                            ? 'border-primary scale-105'
                            : 'border-gray-200 hover:border-gray-400'
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
              <div>
                {/* Brand */}
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.brand.name}
                </p>

                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                  {product.name}
                </h1>

                {/* Category */}
                <p className="text-gray-600 mb-4">
                  Category: <span className="font-semibold">{product.category.title}</span>
                </p>

                {/* Rating */}
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(product.average_rating))}
                      {'☆'.repeat(5 - Math.round(product.average_rating))}
                    </div>
                    <span className="text-gray-600">
                      ({product.reviews.length} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  {selectedVariant ? (
                    <div className="text-3xl font-bold text-primary">
                      {CURRENCY}{Number(selectedVariant.price).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-primary">
                      Select size to see price
                    </div>
                  )}
                </div>

                {/* Size Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Size / Variant
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                            selectedVariant?.id === variant.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-primary/50'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">
                            {variant.size_name}
                          </div>
                          {variant.thickness && (
                            <div className="text-sm text-gray-600">{variant.thickness}</div>
                          )}
                          <div className="text-sm font-bold text-primary mt-1">
                            {CURRENCY}{Number(variant.price).toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors duration-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-blue-900 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                  >
                    🛒 Add to Cart
                  </button>
                  <button className="sm:w-auto px-6 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-semibold transition-all duration-300">
                    ❤️ Wishlist
                  </button>
                </div>

                {/* Contact Options */}
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-3">Need help? Contact us:</p>
                  <div className="flex gap-4">
                    <a
                      href="tel:+2348012345678"
                      className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent py-3 rounded-lg font-semibold text-center transition-all duration-300"
                    >
                      📞 Call
                    </a>
                    <a
                      href="https://wa.me/2348012345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-3 rounded-lg font-semibold text-center transition-all duration-300"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-xl shadow-md mb-8">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <div className="flex border-b pb-3">
                    <span className="w-1/3 font-semibold text-gray-700">Brand:</span>
                    <span className="w-2/3 text-gray-600">{product.brand.name}</span>
                  </div>
                  <div className="flex border-b pb-3">
                    <span className="w-1/3 font-semibold text-gray-700">Category:</span>
                    <span className="w-2/3 text-gray-600">{product.category.title}</span>
                  </div>
                  {product.weight && (
                    <div className="flex border-b pb-3">
                      <span className="w-1/3 font-semibold text-gray-700">Weight:</span>
                      <span className="w-2/3 text-gray-600">{product.weight.weight}</span>
                    </div>
                  )}
                  <div className="flex border-b pb-3">
                    <span className="w-1/3 font-semibold text-gray-700">Available Sizes:</span>
                    <span className="w-2/3 text-gray-600">
                      {product.variants.map((v) => v.size_name).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Review List */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">
                                {review.customer_name}
                              </span>
                              <div className="flex text-yellow-400">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            {review.image && (
                              <img
                                src={review.image}
                                alt="Review"
                                className="mt-3 w-32 h-32 object-cover rounded-lg"
                              />
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                    )}
                  </div>

                  {/* Review Form */}
                  <div className="border-t pt-8">
                    <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={reviewForm.customer_name}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, customer_name: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={reviewForm.email}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, email: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className={`text-3xl ${
                                star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Review
                        </label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, comment: e.target.value })
                          }
                          required
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
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
              <h2 className="text-2xl md:text-3xl font-bold text-darkGray mb-6">
                Related Products
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