// src/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { adminApiService } from '@/lib/adminApi';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminApiService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 2000);
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Dashboard</h1>
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-calendar3 me-1"></i>
            Today
          </button>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-calendar-week me-1"></i>
            This Week
          </button>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-calendar-month me-1"></i>
            This Month
          </button>
        </div>
      </div>

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                        <i className="bi bi-cart-check text-primary fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Total Orders</h6>
                      <h4 className="mb-0">{stats.total.orders}</h4>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> {stats.today.orders} today
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3">
                        <i className="bi bi-currency-naira text-success fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Total Revenue</h6>
                      <h4 className="mb-0">₦{stats.total.revenue.toLocaleString()}</h4>
                      <small className="text-success">
                        <i className="bi bi-arrow-up"></i> ₦{stats.today.revenue.toLocaleString()} today
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                        <i className="bi bi-clock-history text-warning fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Pending Orders</h6>
                      <h4 className="mb-0">{stats.by_status.pending}</h4>
                      <small className="text-muted">
                        <i className="bi bi-clock"></i> Awaiting processing
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-info bg-opacity-10 rounded-circle p-3">
                        <i className="bi bi-truck text-info fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Shipped Orders</h6>
                      <h4 className="mb-0">{stats.by_status.shipped}</h4>
                      <small className="text-muted">
                        <i className="bi bi-box-seam"></i> In transit
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="row">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0">Recent Orders</h5>
                </div>
                <div className="card-body">
                  {stats.recent_orders && stats.recent_orders.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recent_orders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.order_id}</td>
                              <td>{order.customer_name}</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>₦{order.total_amount.toLocaleString()}</td>
                              <td>{new Date(order.created_at).toLocaleDateString()}</td>
                              <td>
                                <Link href={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No recent orders</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0">Order Status</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Pending</span>
                    <span className="badge bg-warning">{stats.by_status.pending}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Processing</span>
                    <span className="badge bg-info">{stats.by_status.processing}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Shipped</span>
                    <span className="badge bg-primary">{stats.by_status.shipped}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Delivered</span>
                    <span className="badge bg-success">{stats.by_status.delivered}</span>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0">Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link href="/admin/products/new" className="btn btn-outline-primary text-start">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New Product
                    </Link>
                    <Link href="/admin/blog/new" className="btn btn-outline-primary text-start">
                      <i className="bi bi-newspaper me-2"></i>
                      Create Blog Post
                    </Link>
                    <Link href="/admin/customers" className="btn btn-outline-primary text-start">
                      <i className="bi bi-people me-2"></i>
                      View Customers
                    </Link>
                    <Link href="/admin/settings/general" className="btn btn-outline-primary text-start">
                      <i className="bi bi-gear me-2"></i>
                      Site Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );

  function getStatusColor(status) {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}