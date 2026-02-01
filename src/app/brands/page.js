'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { apiService } from '@/lib/api';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiService.getBrands();
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mattress Brands</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Shop from Nigeria's most trusted mattress brands
            </p>
          </div>
        </div>

        {/* Brands Section */}
        <section className="py-16 bg-lightGray">
          <div className="container mx-auto px-6 md:px-8">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brands..."
                  className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-48 bg-white rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredBrands.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-lg">
                    {filteredBrands.length} {filteredBrands.length === 1 ? 'brand' : 'brands'}{' '}
                    available
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBrands.map((brand) => (
                    <Link key={brand.id} href={`/shop?brand=${brand.name}`}>
                      <div className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex flex-col items-center justify-center h-full">
                          {brand.logo ? (
                            <div className="h-24 w-full flex items-center justify-center mb-4">
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="h-24 w-full flex items-center justify-center mb-4">
                              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                🏷️
                              </div>
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-primary transition-colors duration-300">
                            {brand.name}
                          </h3>
                          
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No brands found</h3>
                <p className="text-gray-600">Try adjusting your search</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Brands Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                Why Buy Authentic Brands?
              </h2>
              <p className="text-gray-600 text-lg">Quality, comfort, and durability guaranteed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-darkGray mb-3">Genuine Products</h3>
                <p className="text-gray-600">
                  100% authentic mattresses from authorized distributors
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-darkGray mb-3">Warranty Protected</h3>
                <p className="text-gray-600">
                  Full manufacturer warranty on all branded products
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-darkGray mb-3">Premium Quality</h3>
                <p className="text-gray-600">
                  Top-tier materials and craftsmanship in every mattress
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Brands Highlight */}
        {brands.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-primary to-blue-900 text-white">
            <div className="container mx-auto px-6 md:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Brands</h2>
              <p className="text-xl mb-8">Trusted by thousands of Nigerians</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {brands.slice(0, 6).map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/shop?brand=${brand.name}`}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-white font-bold text-lg">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-lightGray">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
              Can't Find Your Preferred Brand?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Contact us and we'll help you find the perfect mattress
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-primary hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </Link>
              <Link
                href="/shop"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}