'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { CURRENCY } from '@/lib/constants';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const pendingOrder = sessionStorage.getItem('pending_order');
    if (pendingOrder) {
      try {
        setOrder(JSON.parse(pendingOrder));
      } catch (err) {
        console.error('Invalid pending_order in sessionStorage', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (orderId) {
      fetchOrderDetails();
      return;
    }

    router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`https://api.mattressmarket.ng/api/orders/track/?order_id=${orderId}`);
      if (!resp.ok) {
        throw new Error(`Failed to fetch order: ${resp.status}`);
      }
      const data = await resp.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load order details');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference, provider = null) => {
    if (!order || !order.order_id) {
      setProcessing(false);
      alert('Order information is missing. Please try again.');
      return false;
    }

    try {
      const resp = await fetch('https://api.mattressmarket.ng/api/orders/payment/callback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.order_id,
          reference,
          provider,
        }),
      });

      const data = await resp.json();
      console.log('verifyPayment response:', resp.status, data);

      if (resp.ok && data.status === 'success') {
        localStorage.setItem('cart', JSON.stringify([]));
        sessionStorage.removeItem('pending_order');
        window.dispatchEvent(new Event('cartUpdated'));

        const redirectId = data.order_id || order.order_id;
        router.push(`/order-success?order_id=${redirectId}&payment=success`);
        return true;
      } else {
        const msg = data.error || data.message || 'Payment verification failed. Please contact support.';
        alert(msg);
        return false;
      }
    } catch (err) {
      console.error('verifyPayment error', err);
      alert('Payment verification error. Please contact support.');
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const handlePaystackPayment = () => {
    if (!order) {
      alert('Order details missing. Please place your order again.');
      return;
    }

    if (!window.PaystackPop || typeof window.PaystackPop.setup !== 'function') {
      alert('Paystack not loaded. Make sure the script is added to your app layout.');
      return;
    }

    setProcessing(true);

    try {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_4ec24c6ca84c59314a1a5dfae74bf9d1b7ba2ccc',
        email: order.customer_email,
        amount: Math.round(Number(order.total_amount) * 100),
        currency: 'NGN',
        ref: order.order_id,
        callback: function (res) {
          console.log('Paystack callback', res);
          verifyPayment(res.reference, 'paystack');
        },
        onClose: function () {
          console.log('Paystack modal closed by user');
          setProcessing(false);
        },
      });

      if (!handler || typeof handler.openIframe !== 'function') {
        setProcessing(false);
        alert('Paystack initialization failed.');
        return;
      }

      handler.openIframe();
    } catch (err) {
      console.error('Paystack error', err);
      setProcessing(false);
      alert('Payment initiation failed. Please try again.');
    }
  };

  const handleFlutterwavePayment = () => {
    if (!order) {
      alert('Order details missing. Please place your order again.');
      return;
    }

    if (!window.FlutterwaveCheckout) {
      alert('Flutterwave not loaded. Make sure the script is added to your app layout.');
      return;
    }

    setProcessing(true);

    try {
      window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: order.order_id,
        amount: Number(order.total_amount),
        currency: 'NGN',
        payment_options: 'card,ussd,banktransfer',
        customer: {
          email: order.customer_email,
          phone_number: order.customer_phone,
          name: order.customer_name,
        },
        callback: function (data) {
          console.log('Flutterwave callback', data);
          const txRef =
            data.transaction_id ||
            data.id ||
            data.tx_id ||
            data.flw_ref ||
            data.tx_ref ||
            data.data?.id ||
            data.data?.transaction_id ||
            null;

          if (!txRef) {
            setProcessing(false);
            alert('Could not read Flutterwave transaction reference. Please contact support.');
            return;
          }

          verifyPayment(txRef, 'flutterwave');
        },
        onclose: function () {
          console.log('Flutterwave modal closed by user');
          setProcessing(false);
        },
        customizations: {
          title: 'Mattress Market',
          description: `Payment for Order ${order.order_id}`,
          logo: 'https://mattressmarket.ng/logo.png',
        },
      });
    } catch (err) {
      console.error('Flutterwave initiation error', err);
      setProcessing(false);
      alert('Payment initiation failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightGray min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-darkGray mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">{order.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-semibold">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold">{order.customer_email}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold text-primary">
              <span>Amount to Pay:</span>
              <span>
                {CURRENCY}
                {Number(order.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-darkGray mb-4">Select Payment Method</h3>

            <div className="space-y-3">
              <button
                onClick={handlePaystackPayment}
                disabled={processing}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💳</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Paystack</div>
                    <div className="text-sm text-gray-600">Pay with card, bank transfer, or USSD</div>
                  </div>
                </div>
                <span className="text-primary font-semibold">→</span>
              </button>

              <button
                onClick={handleFlutterwavePayment}
                disabled={processing}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🦋</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Flutterwave</div>
                    <div className="text-sm text-gray-600">Multiple payment options</div>
                  </div>
                </div>
                <span className="text-primary font-semibold">→</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
          >
            Cancel and Return Home
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🔒 All payments are secured with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </Layout>
  );
}