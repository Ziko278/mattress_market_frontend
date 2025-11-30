import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-lightGray flex items-center justify-center py-16">
        <div className="container mx-auto px-6 md:px-8 max-w-2xl text-center">
          <div className="bg-white rounded-xl shadow-md p-12">
            {/* 404 Icon */}
            <div className="text-9xl mb-6">🛏️</div>

            {/* 404 Text */}
            <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-darkGray mb-4">
              Page Not Found
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Oops! The page you're looking for seems to have disappeared. 
              It might have been moved or deleted.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-primary hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                🏠 Go to Homepage
              </Link>
              <Link
                href="/shop"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                🛒 Browse Products
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-gray-600 mb-4">Or try these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/about" className="text-primary hover:underline">
                  About Us
                </Link>
                <span className="text-gray-400">•</span>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
                <span className="text-gray-400">•</span>
                <Link href="/blog" className="text-primary hover:underline">
                  Blog
                </Link>
                <span className="text-gray-400">•</span>
                <Link href="/brands" className="text-primary hover:underline">
                  Brands
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}