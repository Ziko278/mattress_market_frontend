'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

export default function BrandShowcase() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
            Shop by Brand
          </h2>
          <p className="text-gray-600 text-lg">Trusted brands, quality products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <span className="text-lg font-bold text-gray-700 group-hover:text-primary transition-colors duration-300">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        {brands.length > 12 && (
          <div className="text-center mt-10">
            <Link
              href="/brands"
              className="inline-block bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              View All Brands
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}