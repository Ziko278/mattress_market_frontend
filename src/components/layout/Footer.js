'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { apiService } from '@/lib/api';

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // allow portal & avoid SSR mismatch
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

  const whatsappNumber = siteInfo?.whatsapp ? siteInfo.whatsapp.replace(/\D/g, '') : null;
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=Hello!%20I'm%20interested%20in%20your%20mattresses.` : null;

  // The actual floating button (rendered into document.body)
  const whatsappButton = whatsappLink && isMounted ? createPortal(
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="32"
        height="32"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
      </svg>
    </a>,
    document.body
  ) : null;

  return (
    <>
      {/* Portal-rendered fixed WhatsApp button */}
      {whatsappButton}

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
                  {siteInfo?.whatsapp && (
                    <Link href={`https://wa.me/${siteInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"><i className="bi bi-whatsapp"></i></Link>
                  )}
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="col-lg-2 col-md-3 col-6 footer-widget footer-links">
                <h4 style={{ textAlign: 'left', paddingLeft: '200px' }}>Quick Links</h4>
                <ul style={{listStyleType: 'none', paddingLeft: '200px', textAlign: 'left'}}>
                  <li><Link href="/shop">Shop</Link></li>
                  <li><Link href="/brands">Brands</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/track-order">Track Order</Link></li>
                </ul>
              </div>

              {/* Categories Column */}
              <div className="col-lg-2 col-md-3 col-6 footer-widget footer-links">
                <h4 style={{ textAlign: 'left', paddingLeft: '200px'}}>Categories</h4>
                <ul style={{listStyleType: 'none', paddingLeft: '200px', textAlign: 'left'}}>
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

      <style jsx>{`
        /* Fixed WhatsApp circle (portal -> document.body) */
        .whatsapp-float {
          position: fixed;
          bottom: 32px;               /* padding from bottom (change as needed) */
          left: 32px;                 /* padding from left  (change as needed) */
          width: 72px;                /* slightly bigger */
          height: 72px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #25D366;  /* WhatsApp green */
          color: #fff;
          border-radius: 50%;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.30);
          z-index: 2147483647;        /* very high */
          text-decoration: none;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .whatsapp-float:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 16px 40px rgba(37, 211, 102, 0.40);
        }
        .whatsapp-float svg {
          display: block;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 18px;
            left: 18px;
            width: 62px;
            height: 62px;
          }
          .whatsapp-float svg {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </>
  );
}
