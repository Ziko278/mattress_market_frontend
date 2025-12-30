'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">Browse our wide range of products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.title)}`}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Category Image */}
              <div className="aspect-square relative">
                <img
                  src={category.image || '/placeholder-category.jpg'}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>

              {/* Category Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors duration-300">
                    {toTitleCase(category.title)}
                  </h3>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300"></div>
            </Link>
          ))}
        </div>

        {categories.length > 8 && (
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              View All Categories
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}