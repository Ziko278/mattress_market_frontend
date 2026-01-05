// app/layout.js
import Script from 'next/script';
import "./globals.css";

export const metadata = {
  title: "MattressMarket - Premium Mattresses Online",
  description: "Shop premium mattresses from top brands. Quality sleep delivered to your doorstep.",
};

export default function RootLayout({ children }) {
  // phone number used for both WhatsApp and Call
  const phone = "+2347011680725";
  const whatsappHref = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(phone)}&text&type=phone_number&app_absent=0`;
  const telHref = `tel:${phone}`;

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="v4nEQi8CWrd_qjypK30CA6jTpC8EgCLBxsL1mtPvlCI" />

        {/* Bootstrap CSS (kept as in original) */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />

        {/* Floating buttons styles placed in the head so they are available immediately */}
        <style>{`
          /* Floating action buttons */
          .float-action {
            position: fixed;
            bottom: 20px;
            width: 56px;
            height: 56px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 6px 18px rgba(0,0,0,0.15);
            z-index: 9999;
            text-decoration: none;
            color: #fff;
            font-size: 1.35rem;
            transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
          }

          .float-action:focus {
            outline: 3px solid rgba(0,0,0,0.12);
            outline-offset: 3px;
          }

          .float-action:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.18);
            opacity: 0.98;
          }

          /* WhatsApp: bottom-left */
          .whatsapp-float {
            left: 20px;
            background: linear-gradient(180deg, #25D366, #1DA851);
          }

          /* Call: bottom-right */
          .call-float {
            right: 20px;
            background: linear-gradient(180deg, #0d6efd, #0b5ed7); /* bootstrap primary-ish */
          }

          /* Adjustments for small screens */
          @media (max-width: 420px) {
            .float-action { width: 48px; height: 48px; font-size: 1.15rem; bottom: 16px; }
            .whatsapp-float { left: 12px; }
            .call-float { right: 12px; }
          }
        `}</style>
      </head>

      <body className="antialiased">
        {children}

        {/* Fixed WhatsApp Button (bottom-left) */}
        <a
          href={whatsappHref}
          className="float-action whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Contact us on WhatsApp at ${phone}`}
          title={`Chat on WhatsApp: ${phone}`}
        >
          <i className="bi bi-whatsapp" aria-hidden="true"></i>
        </a>

        {/* Fixed Call Button (bottom-right) */}
        <a
          href={telHref}
          className="float-action call-float"
          aria-label={`Call us at ${phone}`}
          title={`Call: ${phone}`}
        >
          <i className="bi bi-telephone-fill" aria-hidden="true"></i>
        </a>

        {/*
          Load bootstrap JS bundle after interactive
        */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />

        {/*
          Google Tag loader: the external script is loaded afterInteractive,
          and the initialization that references window.dataLayer is also run afterInteractive.
        */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17825757644"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure dataLayer exists and define gtag wrapper
              window.dataLayer = window.dataLayer || [];
              function gtag(){ window.dataLayer.push(arguments); }
              // Initialize gtag
              gtag('js', new Date());
              gtag('config', 'AW-17825757644');
            `,
          }}
        />

        {/*
          Payment SDKs — load afterInteractive so they only run in the browser.
          Using Script ensures they won't run at build time.
        */}
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <Script src="https://checkout.flutterwave.com/v3.js" strategy="afterInteractive" />

      </body>
    </html>
  );
}
