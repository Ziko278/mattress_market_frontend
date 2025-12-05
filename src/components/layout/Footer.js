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
    <footer id="footer" className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="row gy-4">
            {/* About Section */}
            <div className="col-lg-4 col-md-6 footer-widget footer-about">
              <Link href="/" className="logo d-flex align-items-center">
                {siteInfo?.logo ? (
                  <img src={siteInfo.logo} alt={siteInfo.site_name} style={{maxHeight: '40px'}} />
                ) : (
                  <span className="sitename">Mattress<span>Market</span></span>
                )}
              </Link>
              <p>
                Your trusted online store for premium mattresses from top brands. Quality sleep, delivered to your doorstep.
              </p>
              <div className="social-links d-flex mt-3">
                {siteInfo?.facebook && (
                  <Link href={siteInfo.facebook} target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></Link>
                )}
                {siteInfo?.instagram && (
                  <Link href={siteInfo.instagram} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></Link>
                )}
                {siteInfo?.whatsapp && (
                  <Link href={`https://wa.me/${siteInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"><i className="bi bi-whatsapp"></i></Link>
                )}
                 {/* Add other social links if available */}
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-lg-2 col-md-3 footer-widget footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/shop">Shop</Link></li>
                <li><Link href="/brands">Brands</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/track-order">Track Order</Link></li>
              </ul>
            </div>

            {/* Categories Column */}
            <div className="col-lg-2 col-md-3 footer-widget footer-links">
              <h4>Categories</h4>
              <ul>
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/shop?category=${cat.id}`}>{cat.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="col-lg-4 col-md-12 footer-widget footer-contact">
              <h4>Contact Us</h4>
              <p><strong>Address:</strong> {siteInfo?.address || 'A108 Adam Street, New York, NY 535022'}</p>
              <p><strong>Phone:</strong> <Link href={`tel:${siteInfo?.phone || '+1 5589 55488 55'}`}>{siteInfo?.phone || '+1 5589 55488 55'}</Link></p>
              <p><strong>Email:</strong> <Link href={`mailto:${siteInfo?.email || 'info@example.com'}`}>{siteInfo?.email || 'info@example.com'}</Link></p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center justify-content-between flex-wrap">
            <div className="col-md-6">
              <div className="copyright">
                &copy; Copyright {new Date().getFullYear()} MattressMarket. All Rights Reserved.
              </div>
            </div>
            <div className="col-md-6">
              <div className="credits">
                Designed by <Link href="https://bootstrapmade.com/">BootstrapMade</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}