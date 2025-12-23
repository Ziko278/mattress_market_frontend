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
    <>
      {/* Fixed WhatsApp Button */}
      {siteInfo?.whatsapp && (
        <Link 
          href={`https://wa.me/${siteInfo.whatsapp}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="WhatsApp"
        >
          <i className="bi bi-whatsapp"></i>
        </Link>
      )}

      <footer id="footer" className="footer">
        <div className="footer-main">
          <div className="container">
            <div className="row gy-4">
              {/* About Section */}
              <div className="col-lg-4 col-md-6 footer-widget footer-about">
                <Link href="/" className="logo d-flex align-items-center">
                  {siteInfo?.logo ? (
                    <img src={siteInfo.logo} alt={siteInfo.site_name} style={{maxHeight: '100px'}} />
                  ) : (
                    <span className="sitename"></span>
                  )}
                  <br />
                  <span className="sitename">Mattress<span>Market</span></span>
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
                  {/* WhatsApp removed from here as it's now fixed */}
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="col-lg-2 col-md-3 col-6 footer-widget footer-links">
                <h4 style={{ textAlign: 'left', paddingLeft: '200' }}>Quick Links</h4>
                <ul style={{listStyleType: 'none', paddingLeft: '200', textAlign: 'left'}}>
                  <li><Link href="/shop">Shop</Link></li>
                  <li><Link href="/brands">Brands</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/track-order">Track Order</Link></li>
                </ul>
              </div>

              {/* Categories Column */}
              <div className="col-lg-2 col-md-3 col-6 footer-widget footer-links">
                <h4 style={{ textAlign: 'left', paddingLeft: '200'}}>Categories</h4>
                <ul style={{listStyleType: 'none', paddingLeft: '200', textAlign: 'left'}}>
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
                  Designed by <Link href="">Balablu Tech Limited</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add CSS for the fixed WhatsApp button */}
      <style jsx>{`
        .whatsapp-float {
          position: fixed;
          width: 60px;
          height: 60px;
          bottom: 30px;
          left: 30px;
          background-color: #25d366;
          color: white;
          border-radius: 50px;
          text-align: center;
          font-size: 30px;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .whatsapp-float:hover {
          transform: scale(1.1);
          background-color: #128C7E;
        }
        
        .whatsapp-float i {
          margin-top: 0;
        }
      `}</style>
    </>
  );
}