'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { CURRENCY } from '@/lib/constants';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await apiService.trackOrder(orderId);
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16 text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p>Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <Link href="/shop" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-16">
        <div className="container mx-auto px-6 md:px-8 max-w-3xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
              <div className="text-6xl">✅</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order. We'll process it shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-darkGray mb-2">Order Details</h2>
              <p className="text-gray-600">
                Order ID: <span className="font-semibold text-primary">{order.order_id}</span>
              </p>
              <p className="text-gray-600">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-gray-700">{order.customer_name}</p>
              <p className="text-gray-700">{order.customer_email}</p>
              <p className="text-gray-700">{order.customer_phone}</p>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-700">{order.shipping_address}</p>
              <p className="text-gray-700">
                {order.city}, {order.state}
              </p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {CURRENCY}
                      {Number(item.subtotal).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-700 capitalize">{order.payment_method.replace('_', ' ')}</p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary">
                  {CURRENCY}
                  {Number(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="flex-1 bg-primary hover:bg-blue-900 text-white text-center py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/track-order?order_id=${order.order_id}`}
              className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white text-center py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Track Order
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center bg-blue-50 rounded-xl p-6">
            <p className="text-gray-700 mb-2">
              We've sent a confirmation email to{' '}
              <span className="font-semibold">{order.customer_email}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Need help? Contact us via WhatsApp or call our customer service
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}