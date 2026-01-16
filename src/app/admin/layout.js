// src/app/admin/layout.js - Temporary debug version

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import Script from 'next/script';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    // Allow login page without auth check
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    if (!token || !adminUser) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(adminUser);
      // Check if user has admin privileges
      if (!user.is_staff && !user.is_superuser) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      router.push('/admin/login');
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  // Don't show layout for login page
  if (pathname === '/admin/login') {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        {children}
      </>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              border: '0.25em solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spinner-border 0.75s linear infinite',
              color: '#0d6efd',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#6c757d' }}>Loading admin panel...</p>
          </div>
        </div>
      </>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Load Bootstrap CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
        onLoad={() => setStylesLoaded(true)}
      />

      {/* Load Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <div className="admin-wrapper">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="admin-main">
          {/* Top Bar */}
          <TopBar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="admin-content">
            <div className="container-fluid">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay d-lg-none"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #212529;
          background-color: #fff;
        }

        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 0;
          transition: margin-left 0.3s ease;
          width: 100%;
        }

        @media (min-width: 992px) {
          .admin-main {
            margin-left: 280px;
            width: calc(100% - 280px);
          }
        }

        .admin-content {
          flex: 1;
          padding: 1.5rem;
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spinner-border {
          to {
            transform: rotate(360deg);
          }
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Bootstrap basics in case CDN fails */
        .d-flex { display: flex !important; }
        .d-none { display: none !important; }
        .d-block { display: block !important; }
        .flex-column { flex-direction: column !important; }
        .align-items-center { align-items: center !important; }
        .justify-content-center { justify-content: center !important; }
        .justify-content-between { justify-content: space-between !important; }
        .mb-0 { margin-bottom: 0 !important; }
        .mb-1 { margin-bottom: 0.25rem !important; }
        .mb-2 { margin-bottom: 0.5rem !important; }
        .mb-3 { margin-bottom: 1rem !important; }
        .mb-4 { margin-bottom: 1.5rem !important; }
        .me-1 { margin-right: 0.25rem !important; }
        .me-2 { margin-right: 0.5rem !important; }
        .me-3 { margin-right: 1rem !important; }
        .ms-2 { margin-left: 0.5rem !important; }
        .ms-3 { margin-left: 1rem !important; }
        .ms-auto { margin-left: auto !important; }
        .p-3 { padding: 1rem !important; }
        .p-4 { padding: 1.5rem !important; }
        .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .py-3 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        .py-4 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
        .px-3 { padding-left: 1rem !important; padding-right: 1rem !important; }
        .w-100 { width: 100% !important; }
        .h-100 { height: 100% !important; }
        .min-vh-100 { min-height: 100vh !important; }
        .text-center { text-align: center !important; }
        .text-start { text-align: left !important; }
        .text-muted { color: #6c757d !important; }
        .text-primary { color: #0d6efd !important; }
        .text-success { color: #198754 !important; }
        .text-danger { color: #dc3545 !important; }
        .text-warning { color: #ffc107 !important; }
        .text-info { color: #0dcaf0 !important; }
        .bg-light { background-color: #f8f9fa !important; }
        .bg-white { background-color: #fff !important; }
        .bg-primary { background-color: #0d6efd !important; }
        .bg-success { background-color: #198754 !important; }
        .bg-warning { background-color: #ffc107 !important; }
        .bg-info { background-color: #0dcaf0 !important; }
        .border-0 { border: 0 !important; }
        .rounded { border-radius: 0.375rem !important; }
        .rounded-circle { border-radius: 50% !important; }
        .shadow-sm { box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important; }
        .container-fluid { width: 100%; padding-right: 0.75rem; padding-left: 0.75rem; margin-right: auto; margin-left: auto; }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          word-wrap: break-word;
          background-color: #fff;
          background-clip: border-box;
          border: 1px solid rgba(0, 0, 0, 0.125);
          border-radius: 0.375rem;
        }

        .card-body {
          flex: 1 1 auto;
          padding: 1rem;
        }

        .card-header {
          padding: 0.5rem 1rem;
          margin-bottom: 0;
          background-color: rgba(0, 0, 0, 0.03);
          border-bottom: 1px solid rgba(0, 0, 0, 0.125);
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          line-height: 1.5;
          color: #212529;
          text-align: center;
          text-decoration: none;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          background-color: transparent;
          border: 1px solid transparent;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          border-radius: 0.375rem;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .btn-primary {
          color: #fff;
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
        }

        .btn-outline-primary {
          color: #0d6efd;
          border-color: #0d6efd;
        }

        .btn-outline-primary:hover {
          color: #fff;
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          border-radius: 0.25rem;
        }

        .badge {
          display: inline-block;
          padding: 0.35em 0.65em;
          font-size: 0.75em;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.375rem;
        }

        .spinner-border {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          vertical-align: -0.125em;
          border: 0.25em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }

        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        @media (min-width: 768px) {
          .d-md-flex { display: flex !important; }
          .d-md-none { display: none !important; }
        }

        @media (min-width: 992px) {
          .d-lg-none { display: none !important; }
          .d-lg-flex { display: flex !important; }
        }
      `}</style>
    </>
  );
}