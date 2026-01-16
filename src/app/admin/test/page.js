// src/app/admin/standalone/page.js - Completely self-contained admin page

'use client';

import { useState } from 'react';

export default function StandaloneAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = {
    total: { orders: 1234, revenue: 5000000 },
    today: { orders: 45, revenue: 250000 },
    by_status: {
      pending: 23,
      processing: 15,
      shipped: 32,
      delivered: 89
    },
    recent_orders: [
      { id: 1, order_id: 'ORD-001', customer_name: 'John Doe', status: 'pending', total_amount: 50000, created_at: '2025-01-15' },
      { id: 2, order_id: 'ORD-002', customer_name: 'Jane Smith', status: 'shipped', total_amount: 75000, created_at: '2025-01-14' },
      { id: 3, order_id: 'ORD-003', customer_name: 'Bob Johnson', status: 'delivered', total_amount: 120000, created_at: '2025-01-13' }
    ]
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        left: sidebarOpen ? '0' : '-280px',
        ...(typeof window !== 'undefined' && window.innerWidth >= 992 ? { left: '0' } : {})
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.brandContainer}>
            <span style={styles.brandIcon}>🛏️</span>
            <span style={styles.brandText}>MattressMarket</span>
          </div>
          <button style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        <nav style={styles.sidebarNav}>
          <a href="/admin" style={styles.navLink}>
            <span style={styles.navIcon}>📊</span>
            <span>Dashboard</span>
          </a>
          <a href="/admin/blog" style={styles.navLink}>
            <span style={styles.navIcon}>📰</span>
            <span>Blog</span>
          </a>
          <a href="/admin/products" style={styles.navLink}>
            <span style={styles.navIcon}>📦</span>
            <span>Products</span>
          </a>
          <a href="/admin/orders" style={styles.navLink}>
            <span style={styles.navIcon}>🛒</span>
            <span>Orders</span>
          </a>
          <a href="/admin/customers" style={styles.navLink}>
            <span style={styles.navIcon}>👥</span>
            <span>Customers</span>
          </a>
          <a href="/admin/settings" style={styles.navLink}>
            <span style={styles.navIcon}>⚙️</span>
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div style={styles.topBarRight}>
            <span style={styles.adminBadge}>Admin Panel</span>
            <div style={styles.userAvatar}>AD</div>
          </div>
        </header>

        {/* Page Content */}
        <main style={styles.content}>
          <h1 style={styles.pageTitle}>Dashboard</h1>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#e3f2fd'}}>
                <span style={{fontSize: '24px'}}>🛒</span>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Total Orders</div>
                <div style={styles.statValue}>{stats.total.orders}</div>
                <div style={styles.statSubtext}>↗ {stats.today.orders} today</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#e8f5e9'}}>
                <span style={{fontSize: '24px'}}>₦</span>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Total Revenue</div>
                <div style={styles.statValue}>₦{stats.total.revenue.toLocaleString()}</div>
                <div style={styles.statSubtext}>↗ ₦{stats.today.revenue.toLocaleString()} today</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#fff3e0'}}>
                <span style={{fontSize: '24px'}}>⏱️</span>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Pending Orders</div>
                <div style={styles.statValue}>{stats.by_status.pending}</div>
                <div style={styles.statSubtext}>Awaiting processing</div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#e0f2f1'}}>
                <span style={{fontSize: '24px'}}>🚚</span>
              </div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Shipped Orders</div>
                <div style={styles.statValue}>{stats.by_status.shipped}</div>
                <div style={styles.statSubtext}>In transit</div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={styles.section}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Recent Orders</h2>
              </div>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_orders.map((order) => (
                      <tr key={order.id} style={styles.tableRow}>
                        <td style={styles.td}>{order.order_id}</td>
                        <td style={styles.td}>{order.customer_name}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: getStatusColor(order.status)
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={styles.td}>₦{order.total_amount.toLocaleString()}</td>
                        <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Status Summary */}
          <div style={styles.section}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Order Status</h2>
              </div>
              <div style={{padding: '20px'}}>
                <div style={styles.statusItem}>
                  <span>Pending</span>
                  <span style={{...styles.badge, backgroundColor: '#ff9800'}}>{stats.by_status.pending}</span>
                </div>
                <div style={styles.statusItem}>
                  <span>Processing</span>
                  <span style={{...styles.badge, backgroundColor: '#2196f3'}}>{stats.by_status.processing}</span>
                </div>
                <div style={styles.statusItem}>
                  <span>Shipped</span>
                  <span style={{...styles.badge, backgroundColor: '#03a9f4'}}>{stats.by_status.shipped}</span>
                </div>
                <div style={styles.statusItem}>
                  <span>Delivered</span>
                  <span style={{...styles.badge, backgroundColor: '#4caf50'}}>{stats.by_status.delivered}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    pending: '#ff9800',
    processing: '#2196f3',
    shipped: '#03a9f4',
    delivered: '#4caf50',
    cancelled: '#f44336'
  };
  return colors[status] || '#9e9e9e';
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'white',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  brandIcon: {
    fontSize: '1.5rem'
  },
  brandText: {
    color: 'white'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0',
    width: '30px',
    height: '30px'
  },
  sidebarNav: {
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent'
  },
  navIcon: {
    fontSize: '1.25rem'
  },
  mainContent: {
    flex: 1,
    marginLeft: '0',
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.3s ease'
  },
  topBar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px 10px'
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  adminBadge: {
    padding: '5px 12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.875rem'
  },
  content: {
    flex: 1,
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  pageTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px'
  },
  statSubtext: {
    fontSize: '0.8125rem',
    color: '#4caf50'
  },
  section: {
    marginBottom: '30px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    color: '#333'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f5f5f5'
  },
  th: {
    padding: '15px 20px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: '#666',
    borderBottom: '2px solid #e0e0e0'
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '15px 20px',
    fontSize: '0.9375rem',
    color: '#333'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'white',
    display: 'inline-block'
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999
  }
};