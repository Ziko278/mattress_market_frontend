'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { CURRENCY } from '@/lib/constants';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login?return=/account');
      return;
    }

    setUser(JSON.parse(userData));
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const ordersResponse = await apiService.getUserOrders();
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
              My Account
            </h1>
            <p className="text-gray-600">Welcome back, {user.first_name}!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                    {user.first_name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'overview'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-lightGray'
                    }`}
                  >
                    📊 Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'orders'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-lightGray'
                    }`}
                  >
                    📦 My Orders
                  </button>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-lightGray transition-all duration-300"
                  >
                    ❤️ Wishlist
                  </Link>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'addresses'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-lightGray'
                    }`}
                  >
                    📍 Addresses
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'profile'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-lightGray'
                    }`}
                  >
                    👤 Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    🚪 Logout
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📦</div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{orders.length}</p>
                          <p className="text-sm text-gray-600">Total Orders</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">⏳</div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-secondary">
                            {orders.filter((o) => o.status === 'pending').length}
                          </p>
                          <p className="text-sm text-gray-600">Pending Orders</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">✅</div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent">
                            {orders.filter((o) => o.status === 'delivered').length}
                          </p>
                          <p className="text-sm text-gray-600">Delivered</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-darkGray">Recent Orders</h2>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        View All
                      </button>
                    </div>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors duration-300"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Order #{order.order_id}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()} •{' '}
                                  {order.items.length} items
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    order.status === 'delivered'
                                      ? 'bg-green-100 text-green-700'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-100 text-blue-700'
                                      : order.status === 'processing'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {order.status}
                                </span>
                                <span className="font-bold text-primary">
                                  {CURRENCY}
                                  {Number(order.total_amount).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-gray-600 mb-4">No orders yet</p>
                        <Link
                          href="/shop"
                          className="inline-block bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Order History</h2>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div>
                              <p className="font-bold text-lg text-gray-900">
                                Order #{order.order_id}
                              </p>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  order.status === 'delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-700'
                                    : order.status === 'processing'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {order.status}
                              </span>
                              <span className="font-bold text-primary text-lg">
                                {CURRENCY}
                                {Number(order.total_amount).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="border-t pt-4 space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.product_name} - {item.size} × {item.quantity}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {CURRENCY}
                                  {Number(item.subtotal).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex gap-3">
                            <Link
                              href={`/track-order?order_id=${order.order_id}`}
                              className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white text-center py-2 rounded-lg font-semibold transition-all duration-300"
                            >
                              Track Order
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <Link
                        href="/shop"
                        className="inline-block bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-darkGray">Saved Addresses</h2>
                    <button className="bg-primary hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                      + Add New Address
                    </button>
                  </div>

                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📍</div>
                    <p className="text-gray-600">No saved addresses yet</p>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-darkGray mb-6">Profile Settings</h2>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.first_name}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.last_name}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  {/* Change Password */}
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-bold text-darkGray mb-4">Change Password</h3>
                    <form className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-secondary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}