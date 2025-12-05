'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CURRENCY } from '@/lib/constants';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the Link from navigating
    // TODO: Implement actual wishlist functionality
    setIsWishlisted(!isWishlisted);
    console.log('Toggled wishlist for:', product.name);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the Link from navigating
    // TODO: Implement actual add to cart functionality
    console.log('Add to cart:', product.id);
  };

  // Format price range
  const getPriceDisplay = () => {
    if (!product.price_range) return `${CURRENCY}${Number(product.price || 0).toLocaleString()}`;
    
    const { min, max } = product.price_range;
    if (min === max) {
      return `${CURRENCY}${Number(min).toLocaleString()}`;
    }
    return `${CURRENCY}${Number(min).toLocaleString()} - ${CURRENCY}${Number(max).toLocaleString()}`;
  };

  return (
    <>
      {/* Custom CSS for the hover effect */}
      <style jsx>{`
        .product-card-wrapper {
          position: relative;
          overflow: hidden;
        }
        .card-overlay {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .product-card-wrapper:hover .card-overlay {
          opacity: 1;
        }
        .card-img-container {
          aspect-ratio: 1 / 1;
        }
      `}</style>

      <div className="product-card-wrapper">
        <Link href={`/product/${product.slug}`} className="text-decoration-none text-dark">
          <div className="card h-100">
            {/* Product Image Container */}
            <div className="card-img-container position-relative overflow-hidden">
              <img
                src={product.main_image || '/placeholder-product.jpg'}
                className="card-img-top img-fluid"
                alt={product.name}
                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
              />
              
              {/* Badges */}
              <div className="position-absolute top-0 start-0 p-2">
                {product.is_featured && (
                  <span className="badge bg-warning text-dark me-1">Featured</span>
                )}
                {product.is_new_arrival && (
                  <span className="badge bg-success">New</span>
                )}
              </div>

              {/* Quick Actions Overlay */}
              <div className="card-overlay position-absolute bottom-0 start-0 w-100 p-3 text-center">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary w-100"
                >
                  <i className="bi bi-cart-plus me-2"></i>Add to Cart
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="card-body d-flex flex-column">
              {/* Brand */}
              <p className="card-text text-uppercase text-muted small mb-1">
                {product.brand_name}
              </p>

              {/* Product Name */}
              <h5 className="card-title flex-grow-1 mb-2">{product.name}</h5>

              {/* Category */}
              <p className="card-text text-muted small mb-auto">
                {product.category_name}
              </p>

              {/* Price */}
              <div className="d-flex align-items-center justify-content-between mt-2">
                <span className="fw-bold text-primary">
                  {getPriceDisplay()}
                </span>
                
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className="btn btn-outline-danger btn-sm"
                  aria-label="Add to wishlist"
                >
                  <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}