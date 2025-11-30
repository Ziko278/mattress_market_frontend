'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch site info and categories on component mount
  useEffect(() => {
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

    // Cart count management
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount(); // Initial load
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${searchQuery}`;
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {siteInfo && (
              <>
                <a href={`tel:${siteInfo.phone}`} className="hover:text-secondary transition">
                  📞 {siteInfo.phone}
                </a>
                <a href={`mailto:${siteInfo.email}`} className="hover:text-secondary transition hidden md:block">
                  ✉️ {siteInfo.email}
                </a>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/track-order" className="hover:text-secondary transition">
              Track Order
            </Link>
            {siteInfo?.whatsapp && (
              <a 
                href={`https://wa.me/${siteInfo.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-secondary transition"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {siteInfo?.logo ? (
                <img src={siteInfo.logo} alt={siteInfo.site_name} className="h-12 w-auto" />
              ) : (
                <div className="text-2xl font-bold text-primary">
                  Mattress<span className="text-secondary">Market</span>
                </div>
              )}
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <input
                type="text"
                placeholder="Search for mattresses, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-primary"
              />
              <button 
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-r-lg hover:bg-blue-900 transition"
              >
                🔍
              </button>
            </form>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <Link href="/account" className="hidden md:flex items-center space-x-1 hover:text-primary transition">
                <span className="text-2xl">👤</span>
                <span className="text-sm">Account</span>
              </Link>

              <Link href="/wishlist" className="hidden md:flex items-center space-x-1 hover:text-primary transition">
                <span className="text-2xl">❤️</span>
                <span className="text-sm">Wishlist</span>
              </Link>

              <Link href="/cart" className="flex items-center space-x-1 hover:text-primary transition relative">
                <span className="text-2xl">🛒</span>
                <span className="text-sm hidden md:block">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-2xl"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="md:hidden mt-4 flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-lg"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Navigation */}
        <nav className="bg-lightGray border-t border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="hidden md:flex items-center justify-center space-x-8 py-3">
              <li>
                <Link href="/" className="hover:text-primary transition font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary transition font-medium">
                  Shop
                </Link>
              </li>
              <li className="relative group">
                <button className="hover:text-primary transition font-medium">
                  Categories ▼
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {categories.slice(0, 5).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      className="block px-4 py-2 hover:bg-lightGray transition"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </li>
              <li>
                <Link href="/brands" className="hover:text-primary transition font-medium">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition font-medium">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 space-y-2">
                <Link href="/" className="block py-2 hover:text-primary transition">
                  Home
                </Link>
                <Link href="/shop" className="block py-2 hover:text-primary transition">
                  Shop
                </Link>
                <Link href="/brands" className="block py-2 hover:text-primary transition">
                  Brands
                </Link>
                <Link href="/blog" className="block py-2 hover:text-primary transition">
                  Blog
                </Link>
                <Link href="/about" className="block py-2 hover:text-primary transition">
                  About Us
                </Link>
                <Link href="/contact" className="block py-2 hover:text-primary transition">
                  Contact
                </Link>
                <Link href="/account" className="block py-2 hover:text-primary transition">
                  👤 Account
                </Link>
                <Link href="/wishlist" className="block py-2 hover:text-primary transition">
                  ❤️ Wishlist
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}