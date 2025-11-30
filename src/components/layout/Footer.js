'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState(null);
  const [categories, setCategories] = useState([]);

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
        console.error('Error fetching footer data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-darkGray text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Mattress<span className="text-secondary">Market</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted online store for premium mattresses from top brands. Quality sleep, delivered to your doorstep.
            </p>
            {siteInfo && (
              <div className="space-y-2">
                <a href={`tel:${siteInfo.phone}`} className="block hover:text-secondary transition">
                  📞 {siteInfo.phone}
                </a>
                {siteInfo.alternate_phone && (
                  <a href={`tel:${siteInfo.alternate_phone}`} className="block hover:text-secondary transition">
                    📞 {siteInfo.alternate_phone}
                  </a>
                )}
                <a href={`mailto:${siteInfo.email}`} className="block hover:text-secondary transition">
                  ✉️ {siteInfo.email}
                </a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-400 hover:text-white transition">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-white transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/shop?category=${cat.id}`} 
                    className="text-gray-400 hover:text-white transition"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-gray-400 hover:text-white transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-400 hover:text-white transition">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>

            {/* Social Media */}
            {siteInfo && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {siteInfo.facebook && (
                    <a 
                      href={siteInfo.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-2xl hover:text-secondary transition"
                    >
                      📘
                    </a>
                  )}
                  {siteInfo.instagram && (
                    <a 
                      href={siteInfo.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-2xl hover:text-secondary transition"
                    >
                      📷
                    </a>
                  )}
                  {siteInfo.whatsapp && (
                    <a 
                      href={`https://wa.me/${siteInfo.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-2xl hover:text-secondary transition"
                    >
                      💬
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MattressMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}