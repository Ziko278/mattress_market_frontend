'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';
import { CURRENCY } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'pay_on_delivery',
    expected_delivery_date: '',
  expected_delivery_time: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(cart);

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(token);
    }

    // Fetch settings
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('https://api.mattressmarket.ng/api/users/profile/with-address/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const data = await response.json();
      setUserProfile(data);

      // Pre-fill form with user data
      setFormData({
        customer_name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || '',
        customer_email: data.email || '',
        customer_phone: data.profile?.phone || '',
        shipping_address: data.default_address?.address || '',
        payment_method: 'pay_on_delivery',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await apiService.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Full name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email is invalid';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Phone number is invalid';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required';
    }

    if (!formData.expected_delivery_date) {
      newErrors.expected_delivery_date = 'Please select a delivery date';
    }

    if (!formData.expected_delivery_time) {
      newErrors.expected_delivery_time = 'Please select a delivery time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // ---------- REPLACED handleSubmit (robust + defensive) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        product_variant: item.variant_id,
        product_name: item.product_name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        ...formData,
        payment_method: formData.payment_method, // ensure it's sent
        total_amount: getTotal(),
        items,
      };

      // Create order
      const response = await apiService.createOrder(orderData);

      // Safe unwrap - support axios or fetch wrappers
      const payload = response?.data ?? response;

      console.log('createOrder payload:', payload);

      if (!payload) {
        throw new Error('Empty response from server');
      }

      const createdOrder = payload.order ?? payload;
      const paymentRequired = Boolean(payload.payment_required);

      if (!paymentRequired || formData.payment_method === 'pay_on_delivery') {
        // For pay on delivery: email already sent by backend.
        localStorage.setItem('cart', JSON.stringify([]));
        window.dispatchEvent(new Event('cartUpdated'));
        router.push(`/order-success?order_id=${createdOrder.order_id}`);
        return;
      }

      // Online payment: save pending order and go to payment page
      sessionStorage.setItem('pending_order', JSON.stringify(createdOrder));
      router.push(`/payment?order_id=${createdOrder.order_id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create order. Check console/network and try again.');
    } finally {
      setLoading(false);
    }
  };
  // ---------- END handleSubmit replacement ----------

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order</p>
            {isLoggedIn && userProfile && (
              <p className="text-sm text-success mt-2">
                ✓ Logged in as {userProfile.username} - Your details have been pre-filled
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Contact Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                          errors.customer_name
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.customer_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                          errors.customer_email
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.customer_email && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                          errors.customer_phone
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="+234 800 000 0000"
                      />
                      {errors.customer_phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Shipping Address</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address in Abuja *
                      </label>
                      <textarea
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                          errors.shipping_address
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="Enter your full delivery address in Abuja (e.g., House 123, Street Name, Area, Abuja)"
                      ></textarea>
                      {errors.shipping_address && (
                        <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expected Delivery */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Expected Delivery</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        name="expected_delivery_date"
                        value={formData.expected_delivery_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                          errors.expected_delivery_date
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                      />
                      {errors.expected_delivery_date && (
                        <p className="text-red-500 text-sm mt-1">{errors.expected_delivery_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Time *
                      </label>
                      <input
                          type="time"
                          name="expected_delivery_time"
                          value={formData.expected_delivery_time}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                            errors.expected_delivery_time
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-primary'
                          }`}
                        />
                      {errors.expected_delivery_time && (
                        <p className="text-red-500 text-sm mt-1">{errors.expected_delivery_time}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Payment Method</h2>

                  <div className="space-y-3">
                    {settings?.allow_pay_on_delivery && (
                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors duration-300">
                        <input
                          type="radio"
                          name="payment_method"
                          value="pay_on_delivery"
                          checked={formData.payment_method === 'pay_on_delivery'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Pay on Delivery</div>
                          <div className="text-sm text-gray-600">
                            Pay with cash when your order arrives
                          </div>
                        </div>
                        <span className="text-2xl">💵</span>
                      </label>
                    )}

                    {settings?.allow_online_payment && (
                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors duration-300">
                        <input
                          type="radio"
                          name="payment_method"
                          value="online"
                          checked={formData.payment_method === 'online'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Online Payment</div>
                          <div className="text-sm text-gray-600">
                            Pay securely with card or bank transfer
                          </div>
                        </div>
                        <span className="text-2xl">💳</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.variant_id} className="flex gap-3">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {item.product_name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {item.size} × {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-primary">
                            {CURRENCY}
                            {Number(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-semibold">
                        {CURRENCY}
                        {Number(getSubtotal()).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping:</span>
                      <span className="font-semibold">
                        {getShippingFee() === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `${CURRENCY}${Number(getShippingFee()).toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-darkGray">
                      <span>Total:</span>
                      <span className="text-primary">
                        {CURRENCY}
                        {Number(getTotal()).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-blue-900 hover:scale-105'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : formData.payment_method === 'online' ? (
                      'Proceed to Payment'
                    ) : (
                      'Place Order'
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="mt-4 text-center text-sm text-gray-600">
                    🔒 Your information is secure and encrypted
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
