// src/components/admin/TopBar.js

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function TopBar({ onMenuClick }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing admin user:', error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    }
  };

  const getInitials = (user) => {
    if (!user) return 'A';
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username ? user.username[0].toUpperCase() : 'A';
  };

  const getDisplayName = (user) => {
    if (!user) return 'Admin';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || 'Admin';
  };

  return (
    <>
      <header style={styles.topBar}>
        <div style={styles.topBarContainer}>
          {/* Left Section */}
          <div style={styles.topBarLeft}>
            <button
              style={styles.btnMenuToggle}
              onClick={onMenuClick}
              aria-label="Toggle menu"
              onMouseEnter={(e) => e.currentTarget.style.color = '#1e3a8a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
            >
              ☰
            </button>

            <div style={styles.adminBadge}>
              <span style={{marginRight: '8px'}}>🛡️</span>
              <span style={styles.adminBadgeText}>Admin Panel</span>
            </div>
          </div>

          {/* Right Section */}
          <div style={styles.topBarRight}>
            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <a
                href="/"
                target="_blank"
                style={styles.btnQuickAction}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <span style={{marginRight: '5px'}}>↗</span>
                <span style={styles.quickActionText}>Website</span>
              </a>
            </div>

            {/* Notifications */}
            <button
              style={styles.btnIcon}
              title="Notifications"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1e3a8a';
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4b5563';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              🔔
              <span style={styles.notificationBadge}>3</span>
            </button>

            {/* Profile Dropdown */}
            <div style={styles.profileDropdown} ref={profileMenuRef}>
              <button
                style={styles.profileTrigger}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-expanded={showProfileMenu}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={styles.profileAvatar}>
                  {getInitials(adminUser)}
                </div>
                <div style={styles.profileInfo}>
                  <span style={styles.profileName}>{getDisplayName(adminUser)}</span>
                  <span style={styles.profileRole}>
                    {adminUser?.is_superuser ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
                <span style={styles.profileArrow}>{showProfileMenu ? '▲' : '▼'}</span>
              </button>

              {showProfileMenu && (
                <div style={styles.profileMenu}>
                  <div style={styles.profileMenuHeader}>
                    <div style={styles.profileAvatarLarge}>
                      {getInitials(adminUser)}
                    </div>
                    <div style={styles.profileDetails}>
                      <div style={styles.profileNameLarge}>{getDisplayName(adminUser)}</div>
                      <div style={styles.profileEmail}>{adminUser?.email || 'admin@mattressmarket.ng'}</div>
                    </div>
                  </div>

                  <div style={styles.profileMenuDivider}></div>

                  <div style={styles.profileMenuBody}>
                    <button
                      style={styles.profileMenuItem}
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/admin/profile');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{marginRight: '8px'}}>👤</span>
                      My Profile
                    </button>
                    <button
                      style={styles.profileMenuItem}
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push('/admin/settings/general');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{marginRight: '8px'}}>⚙️</span>
                      Settings
                    </button>
                  </div>

                  <div style={styles.profileMenuDivider}></div>

                  <div style={styles.profileMenuFooter}>
                    <button
                      style={{...styles.profileMenuItem, color: '#dc2626'}}
                      onClick={handleLogout}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{marginRight: '8px'}}>🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

const styles = {
  topBar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  topBarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '100%'
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  btnMenuToggle: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    padding: '0.5rem',
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'color 0.2s',
    borderRadius: '0.375rem'
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.375rem 0.75rem',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  adminBadgeText: {
    display: 'none'
  },
  quickActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  btnQuickAction: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    color: '#4b5563',
    textDecoration: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  },
  quickActionText: {
    display: 'none'
  },
  btnIcon: {
    position: 'relative',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    padding: '0.5rem',
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRadius: '0.375rem'
  },
  notificationBadge: {
    position: 'absolute',
    top: '0.25rem',
    right: '0.25rem',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '0.625rem',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    fontWeight: '600'
  },
  profileDropdown: {
    position: 'relative'
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'none',
    border: '1px solid #e5e7eb',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  profileAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  profileInfo: {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left'
  },
  profileName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 1.2
  },
  profileRole: {
    fontSize: '0.75rem',
    color: '#6b7280',
    lineHeight: 1.2
  },
  profileArrow: {
    fontSize: '0.625rem',
    color: '#6b7280',
    marginLeft: '0.25rem'
  },
  profileMenu: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    width: '280px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    animation: 'slideDown 0.2s ease',
    zIndex: 1001
  },
  profileMenuHeader: {
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  profileAvatarLarge: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '1.125rem',
    flexShrink: 0
  },
  profileDetails: {
    flex: 1,
    minWidth: 0
  },
  profileNameLarge: {
    fontSize: '0.9375rem',
    fontWeight: '600',
    color: '#1f2937',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  profileEmail: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  profileMenuDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: 0
  },
  profileMenuBody: {
    padding: '0.5rem'
  },
  profileMenuFooter: {
    padding: '0.5rem'
  },
  profileMenuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0.625rem 0.75rem',
    background: 'none',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left'
  }
};