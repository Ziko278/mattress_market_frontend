'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false); 
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false); // <--- NEW: State for mobile category dropdown
  const [isScrolled, setIsScrolled] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch site info and categories (Logic remains the same)
  useEffect(() => {
    // ... (your existing fetchData logic)
    const fetchData = async () => {
      try {
        const [siteResponse, categoriesResponse] = await Promise.all([
          apiService.getSiteInfo(),
          apiService.getCategories()
        ]);
        setSiteInfo(siteResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };
    fetchData();

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // Handle scroll effect (Logic remains the same)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler to close account menu when clicking outside (Logic remains the same)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountOpen && !event.target.closest('.account-dropdown')) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountOpen]);

  
  // Handle Mobile Menu Toggle with animation
  const handleMobileMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    setIsCategoryDropdownOpen(false); // Close nested category menu when closing main menu
    
    if (newState) {
        document.body.classList.add('mobile-nav-active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    } else {
        document.body.classList.remove('mobile-nav-active');
        document.body.style.overflow = '';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${searchQuery}`;
    }
  };

  const closeMenusAndNavigate = () => {
      setIsAccountOpen(false);
      setIsCategoryDropdownOpen(false); // Ensure nested menu closes
      if (isMenuOpen) handleMobileMenuToggle();
  };


  return (
    <>
      <header id="header" className={`header position-relative ${isScrolled ? 'scrolled' : ''}`}>
        
        {/* Top Bar (Keep as is) */}
        <div className="top-bar py-2 d-none d-lg-block">
            {/* ... Top Bar content remains the same ... */}
            <div className="container-fluid container-xl">
                <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="d-flex align-items-center">
                    {siteInfo && (
                        <>
                        <div className="top-bar-item me-4">
                            <i className="bi bi-telephone-fill me-2"></i>
                            <span>Support: </span>
                            <a href={`tel:${siteInfo.phone}`}>{siteInfo.phone}</a>
                        </div>
                        <div className="top-bar-item">
                            <i className="bi bi-envelope-fill me-2"></i>
                            <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
                        </div>
                        </>
                    )}
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="d-flex justify-content-end">
                    <div className="top-bar-item me-4">
                        <Link href="/track-order">
                        <i className="bi bi-truck me-2"></i>Track Order
                        </Link>
                    </div>
                    {siteInfo?.whatsapp && (
                        <div className="top-bar-item">
                        <a href={`https://wa.me/${siteInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-whatsapp me-2"></i>WhatsApp
                        </a>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>
        </div>
        {/* End Top Bar */}

        {/* Main Header */}
        <div className="main-header">
          <div className="container-fluid container-xl">
            <div className="d-flex py-3 align-items-center justify-content-between">

              {/* Logo */}
              <Link href="/" className="logo d-flex align-items-center" onClick={closeMenusAndNavigate}>
                {siteInfo?.logo ? (
                  <img src={siteInfo.logo} alt={siteInfo.site_name} style={{maxHeight: '80px'}} />
                ) : (
                  <h1 className="sitename"><span></span></h1>
                )}
                <h1 className="sitename">Mattress<span>Market</span></h1>
              </Link>

              {/* Search Form - Desktop (Keep as is) */}
              <form className="search-form desktop-search-form" onSubmit={handleSearch}>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search for products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn search-btn" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              {/* Actions (Keep as is) */}
              <div className="header-actions d-flex align-items-center justify-content-end">
                
                {/* Account (Dropdown logic remains the same) */}
                <div className={`dropdown account-dropdown ${isAccountOpen ? 'show' : ''}`}>
                  <button 
                    className="header-action-btn" 
                    onClick={() => setIsAccountOpen(prev => !prev)}
                    aria-expanded={isAccountOpen}
                  >
                    <i className="bi bi-person"></i>
                    <span className="action-text d-none d-md-inline-block">Account</span>
                  </button>
                  <div className={`dropdown-menu ${isAccountOpen ? 'show' : ''}`}> 
                    <div className="dropdown-header">
                      <h6>Welcome!</h6>
                      <p className="mb-0">Manage your account</p>
                    </div>
                    <div className="dropdown-body">
                      <Link className="dropdown-item d-flex align-items-center" href="/account" onClick={closeMenusAndNavigate}>
                        <i className="bi bi-person-circle me-2"></i>
                        <span>My Profile</span>
                      </Link>
                      <Link className="dropdown-item d-flex align-items-center" href="/orders" onClick={closeMenusAndNavigate}>
                        <i className="bi bi-bag-check me-2"></i>
                        <span>My Orders</span>
                      </Link>
                    </div>
                    <div className="dropdown-footer">
                      <Link href="/auth/login" className="btn btn-primary w-100 mb-2" onClick={closeMenusAndNavigate}>Sign In</Link>
                      <Link href="/auth/register" className="btn btn-outline-primary w-100" onClick={closeMenusAndNavigate}>Register</Link>
                    </div>
                  </div>
                </div>

                {/* Wishlist and Cart (Keep as is) */}
                <Link href="/wishlist" className="header-action-btn d-none d-md-flex" onClick={closeMenusAndNavigate}>
                  <i className="bi bi-heart"></i>
                  <span className="action-text d-none d-md-inline-block">Wishlist</span>
                </Link>

                <Link href="/cart" className="header-action-btn" onClick={closeMenusAndNavigate}>
                  <i className="bi bi-cart3"></i>
                  <span className="action-text d-none d-md-inline-block">Cart</span>
                  <span className="badge">{cartCount}</span>
                </Link>

                {/* Mobile Navigation Toggle (Keep as is) */}
                <i 
                  className={`mobile-nav-toggle d-xl-none bi ${isMenuOpen ? 'bi-x' : 'bi-list'} me-0`}
                  onClick={handleMobileMenuToggle}
                ></i>

              </div>
            </div>
          </div>
        </div>
        {/* End Main Header */}
        
        {/* Mobile Search Form (Always visible on mobile) (Keep as is) */}
        <div className="container d-block d-md-none py-2">
             <form className="search-form" onSubmit={handleSearch}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn search-btn" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
        </div>
        {/* End Mobile Search */}

        {/* Navigation */}
        <div className="header-nav">
          <div className="container-fluid container-xl position-relative">
            <nav id="navmenu" className="navmenu">
              <ul>
                <li><Link href="/" className="active" onClick={closeMenusAndNavigate}>Home</Link></li>
                <li><Link href="/shop" onClick={closeMenusAndNavigate}>Shop</Link></li>
                
                {/* Mega Menu for Categories - FIX 2: Added state for mobile toggle */}
                <li className={`products-megamenu-1 dropdown ${isCategoryDropdownOpen ? 'active' : ''}`}>
                  <Link 
                    href="/shop"
                    onClick={(e) => {
                        // Only prevent navigation and toggle the dropdown on small screens (mobile menu active)
                        if (isMenuOpen && window.innerWidth < 992) {
                            e.preventDefault();
                            setIsCategoryDropdownOpen(prev => !prev);
                        } else {
                            closeMenusAndNavigate();
                        }
                    }}
                  >
                    <span>Categories</span> <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </Link>
                  
                  {/* Desktop Mega Menu View (Keep as is) */}
                  <div className="desktop-megamenu">
                    <div className="megamenu-content">
                      <div className="row g-3 p-3">
                        {categories.slice(0, 8).map((cat) => (
                          <div key={cat.id} className="col-lg-3 col-md-4 mb-3">
                            <Link href={`/shop?category=${cat.id}`} className="card border-0 shadow-sm h-100 text-decoration-none" onClick={closeMenusAndNavigate}>
                              <div className="position-relative" style={{height: '150px', overflow: 'hidden'}}>
                                <img 
                                  src={cat.image || '/assets/img/category-placeholder.jpg'} 
                                  alt={cat.title} 
                                  className="w-100 h-100 object-fit-cover"
                                />
                              </div>
                              <div className="card-body text-center">
                                <h6 className="card-title text-dark fw-bold mb-0">{cat.title}</h6>
                                {/* <small className="text-muted">{cat.product_count || 0} Products</small> */}
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      <div className="text-center p-2 border-top">
                        <Link href="/shop" className="btn btn-sm btn-outline-primary" onClick={closeMenusAndNavigate}>View All Categories</Link>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Dropdown View - now shown/hidden via the 'active' class on the parent li */}
                  <ul className="mobile-megamenu">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/shop?category=${cat.id}`} onClick={closeMenusAndNavigate}>{cat.title}</Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li><Link href="/brands" onClick={closeMenusAndNavigate}>Brands</Link></li>
                <li><Link href="/blog" onClick={closeMenusAndNavigate}>Blog</Link></li>
                <li><Link href="/about" onClick={closeMenusAndNavigate}>About Us</Link></li>
                <li><Link href="/contact" onClick={closeMenusAndNavigate}>Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>
        {/* End Navigation */}

      </header>

      {/* Mobile Menu Overlay (Keep as is) */}
      {/* {isMenuOpen && <div className="mobile-nav-overly" onClick={handleMobileMenuToggle}></div>} */}
    </>
  );
}