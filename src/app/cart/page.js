'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { CURRENCY } from '@/lib/constants';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadCart();
    fetchSettings();
    setLoading(false);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://api.mattressmarket.ng/api/settings/');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
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

  const handleClearCart = () => {
    setShowClearCartModal(true);
  };

  const confirmClearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowClearCartModal(false);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getShippingFee = () => {
    if (!settings) return 0;
    
    const subtotal = getSubtotal();
    
    // Free if threshold is 0 or subtotal exceeds threshold
    if (parseFloat(settings.free_shipping_threshold) === 0 || 
        subtotal >= parseFloat(settings.free_shipping_threshold)) {
      return 0;
    }
    
    return parseFloat(settings.shipping_fee || 0);
  };

  const getTotal = () => {
    return getSubtotal() + getShippingFee();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="placeholder-glow">
            <div className="row g-4">
              <div className="col-md-8">
                <div className="placeholder p-3 mb-3"></div>
                <div className="placeholder p-1 mb-2 w-75"></div>
                <div className="placeholder p-1 mb-4 w-50"></div>
              </div>
              <div className="col-md-4">
                <div className="placeholder p-4" style={{ height: '300px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
  <>
    <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17825757644"
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-cart"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17825757644');
          `,
        }}
      />

    <Layout>
      <div className="page-title">
        <div className="container">
          <nav className="d-flex justify-content-between">
            <h1>Shopping Cart</h1>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Shopping Cart</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-5">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: '4rem' }}>🛒</div>
            <h2 className="mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="row">
            {/* Cart Items List */}
            <div className="col-lg-8">
              <div className="d-flex justify-content-end mb-3">
                <button onClick={handleClearCart} className="btn btn-sm btn-outline-danger">
                  <i className="bi bi-trash3 me-1"></i> Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item.variant_id} className="card mb-3 flex-row align-items-center">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.product_name}
                    className="img-fluid rounded-start"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title">{item.product_name}</h5>
                        <p className="card-text text-muted small">{item.brand}</p>
                        <p className="card-text text-muted small">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Remove item"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="input-group" style={{ width: '120px' }}>
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.variant_id, parseInt(e.target.value) || 1)}
                          className="form-control text-center"
                        />
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-end">
                        <p className="mb-0 fw-bold">
                          {CURRENCY}
                          {Number(item.price * item.quantity).toLocaleString()}
                        </p>
                        <small className="text-muted">
                          {CURRENCY}
                          {Number(item.price).toLocaleString()} × {item.quantity}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card sticky-top" style={{ top: '20px' }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>

                  <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Subtotal</span>
                      <strong>{CURRENCY}{Number(getSubtotal()).toLocaleString()}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Shipping</span>
                      <strong>
                        {getShippingFee() === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `${CURRENCY}${Number(getShippingFee()).toLocaleString()}`
                        )}
                      </strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Total</strong>
                      <strong className="text-primary">{CURRENCY}{Number(getTotal()).toLocaleString()}</strong>
                    </li>
                  </ul>

                  <Link href="/checkout" className="btn btn-primary w-100 mb-2">
                    Proceed to Checkout
                  </Link>

                  <Link href="/shop" className="btn btn-outline-secondary w-100">
                    Continue Shopping
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-4 pt-4 border-top">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-shield-check text-success"></i>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-truck text-primary"></i>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-cash-coin text-warning"></i>
                      <span>Pay on Delivery Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing Cart */}
      <div className={`modal fade ${showClearCartModal ? 'show' : ''}`} style={{ display: showClearCartModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Clear Cart</h5>
              <button type="button" className="btn-close" onClick={() => setShowClearCartModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove all items from your cart? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowClearCartModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmClearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}