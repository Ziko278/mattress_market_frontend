'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/shared/ProductCard';
import { apiService } from '@/lib/api';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login?return=/wishlist');
      return;
    }

    fetchWishlist();
  }, [router]);

  const fetchWishlist = async () => {
    try {
      const response = await apiService.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    if (!confirm('Remove this item from wishlist?')) return;

    try {
      await apiService.removeFromWishlist(wishlistId);
      setWishlist(wishlist.filter((item) => item.id !== wishlistId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {wishlist.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="relative">
                    <ProductCard product={item.product} />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Save your favorite products to view them later
              </p>
              <a
                href="/shop"
                className="inline-block bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Browse Products
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}