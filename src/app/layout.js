// app/layout.js
import Script from 'next/script';
import "./globals.css";

export const metadata = {
  title: "MattressMarket - Premium Mattresses Online",
  description: "Shop premium mattresses from top brands. Quality sleep delivered to your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Analytics script tag loader (keeps it in head but does not execute JS until afterInteractive) */}
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
      </head>

      <body className="antialiased">
        {children}

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
