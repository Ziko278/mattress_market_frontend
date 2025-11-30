'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { CURRENCY } from '@/lib/constants';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    setLoading(false);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.variant_id === variantId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (variantId) => {
    const updatedCart = cartItems.filter((item) => item.variant_id !== variantId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotal = () => {
    // For now, just return subtotal (shipping will be calculated at checkout)
    return getSubtotal();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.variant_id}
                    className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                            className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors duration-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.variant_id, parseInt(e.target.value) || 1)
                            }
                            className="w-16 h-8 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                          />
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                            className="w-8 h-8 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors duration-300 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {CURRENCY}
                            {Number(item.price).toLocaleString()} × {item.quantity}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {CURRENCY}
                            {Number(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-semibold">
                        {CURRENCY}
                        {Number(getSubtotal()).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping:</span>
                      <span className="font-semibold text-gray-500">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-darkGray">
                      <span>Total:</span>
                      <span className="text-primary">
                        {CURRENCY}
                        {Number(getTotal()).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full bg-primary hover:bg-blue-900 text-white text-center py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 mb-4"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/shop"
                    className="block w-full border-2 border-primary text-primary hover:bg-primary hover:text-white text-center py-4 rounded-lg font-semibold transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">✅</span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">🚚</span>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">💰</span>
                      <span>Pay on Delivery Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}