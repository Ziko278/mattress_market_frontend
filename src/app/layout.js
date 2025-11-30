import "./globals.css";

export const metadata = {
  title: "MattressMarket - Premium Mattresses Online",
  description: "Shop premium mattresses from top brands. Quality sleep delivered to your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}