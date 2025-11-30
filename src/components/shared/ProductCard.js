'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CURRENCY } from '@/lib/constants';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    // TODO: Implement wishlist functionality
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    // TODO: Implement add to cart
    console.log('Add to cart:', product.id);
  };

  // Format price range
  const getPriceDisplay = () => {
    if (!product.price_range) return 'Price on request';
    
    const { min, max } = product.price_range;
    if (min === max) {
      return `${CURRENCY}${Number(min).toLocaleString()}`;
    }
    return `${CURRENCY}${Number(min).toLocaleString()} - ${CURRENCY}${Number(max).toLocaleString()}`;
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.main_image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.is_featured && (
              <span className="block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </span>
            )}
            {product.is_new_arrival && (
              <span className="block bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                New
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlist}
              className="block bg-white hover:bg-red-50 text-red-500 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Overlay with Add to Cart */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-blue-900 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand_name}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-sm text-gray-500 mb-3">
            {product.category_name}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {getPriceDisplay()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}