// app/layout.js

import Script from 'next/script'; // <-- ADD THIS IMPORT
import "./globals.css";

// ⚠️ We REMOVE the local imports since we are using CDNs.
// REMOVED: import 'bootstrap/dist/css/bootstrap.min.css'; 
// REMOVED: import 'bootstrap-icons/font/bootstrap-icons.css'; 

export const metadata = {
  title: "MattressMarket - Premium Mattresses Online",
  description: "Shop premium mattresses from top brands. Quality sleep delivered to your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* This is where we manually inject the CDN links into the <head>.
        Next.js will ensure these <link> tags are rendered correctly.
      */}
      <head>
       
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17825757644"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());

          gtag('config', 'AW-17825757644');
        </script>
        {/* 1. Bootstrap CSS CDN */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
          crossOrigin="anonymous" 
        />
        {/* 2. Bootstrap Icons CDN */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      
      <body className="antialiased">
        {children}
        
        {/* This component is now properly imported and will work */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
 
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <script src="https://checkout.flutterwave.com/v3.js"></script>
      </body>
    </html>
  );
}