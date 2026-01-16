// src/components/admin/Sidebar.js

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActive = (path) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/admin',
      exact: true
    },
    {
      title: 'Blog',
      icon: '📰',
      submenu: [
        { title: 'All Posts', path: '/admin/blog' },
        { title: 'Create Post', path: '/admin/blog/new' },
        { title: 'Categories', path: '/admin/blog/categories' },
        { title: 'Tags', path: '/admin/blog/tags' },
        { title: 'Comments', path: '/admin/blog/comments' }
      ]
    },
    {
      title: 'Products',
      icon: '📦',
      submenu: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Add Product', path: '/admin/products/new' },
        { title: 'Categories', path: '/admin/products/categories' },
        { title: 'Brands', path: '/admin/products/brands' },
        { title: 'Weights', path: '/admin/products/weights' },
        { title: 'Bulk Price Update', path: '/admin/products/bulk-price' }
      ]
    },
    {
      title: 'Orders',
      icon: '🛒',
      path: '/admin/orders'
    },
    {
      title: 'Customers',
      icon: '👥',
      path: '/admin/customers'
    },
    {
      title: 'Reviews',
      icon: '⭐',
      path: '/admin/reviews'
    },
    {
      title: 'Site Config',
      icon: '⚙️',
      submenu: [
        { title: 'Site Info', path: '/admin/settings/site-info' },
        { title: 'Settings', path: '/admin/settings/general' },
        { title: 'Sliders', path: '/admin/settings/sliders' }
      ]
    }
  ];

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      onClose();
    }
  };

  return (
    <>
      <aside style={{
        ...styles.sidebar,
        left: isOpen ? '0' : '-280px'
      }}>
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <Link href="/admin" style={styles.sidebarBrand} onClick={handleLinkClick}>
            <span style={styles.brandIcon}>🛏️</span>
            <span style={styles.brandText}>MattressMarket</span>
          </Link>
          <button
            style={styles.btnCloseSidebar}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav style={styles.sidebarNav}>
          <ul style={styles.navList}>
            {menuItems.map((item, index) => (
              <li key={index} style={styles.navItem}>
                {item.submenu ? (
                  <>
                    <button
                      style={{
                        ...styles.navLink,
                        ...(expandedMenus[item.title] ? styles.navLinkActive : {})
                      }}
                      onClick={() => toggleMenu(item.title)}
                      onMouseEnter={(e) => {
                        if (!expandedMenus[item.title]) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!expandedMenus[item.title]) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span style={styles.navIcon}>{item.icon}</span>
                      <span style={styles.navText}>{item.title}</span>
                      <span style={styles.navArrow}>{expandedMenus[item.title] ? '▼' : '▶'}</span>
                    </button>
                    <ul style={{
                      ...styles.submenu,
                      maxHeight: expandedMenus[item.title] ? '500px' : '0'
                    }}>
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.path}
                            style={{
                              ...styles.navLink,
                              ...styles.submenuLink,
                              ...(isActive(subItem.path) ? styles.navLinkActive : {})
                            }}
                            onClick={handleLinkClick}
                            onMouseEnter={(e) => {
                              if (!isActive(subItem.path)) {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive(subItem.path)) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.path}
                    style={{
                      ...styles.navLink,
                      ...(isActive(item.path) ? styles.navLinkActive : {})
                    }}
                    onClick={handleLinkClick}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span style={styles.navIcon}>{item.icon}</span>
                    <span style={styles.navText}>{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div style={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            style={styles.btnViewWebsite}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            <span style={{marginRight: '8px'}}>↗</span>
            View Website
          </a>
        </div>
      </aside>

      <style jsx global>{`
        @media (min-width: 992px) {
          aside {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'white',
    zIndex: 1050,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto'
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: '600',
    gap: '0.75rem'
  },
  brandIcon: {
    fontSize: '1.5rem'
  },
  brandText: {
    color: 'white'
  },
  btnCloseSidebar: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.75rem',
    padding: '0.25rem',
    cursor: 'pointer',
    opacity: 0.8,
    transition: 'opacity 0.2s',
    lineHeight: 1,
    width: '30px',
    height: '30px'
  },
  sidebarNav: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 0'
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  navItem: {
    margin: 0
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent',
    background: 'none',
    border: 'none',
    borderRadius: 0,
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'inherit'
  },
  navLinkActive: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: '#f97316'
  },
  navIcon: {
    marginRight: '0.75rem',
    fontSize: '1.25rem'
  },
  navText: {
    flex: 1
  },
  navArrow: {
    marginLeft: 'auto',
    fontSize: '0.75rem',
    opacity: 0.8
  },
  submenu: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  submenuLink: {
    paddingLeft: '3.5rem',
    fontSize: '0.9rem'
  },
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  btnViewWebsite: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    textAlign: 'center',
    color: 'white',
    textDecoration: 'none',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    backgroundColor: 'transparent'
  }
};