'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/shared/ProductCard';
import { apiService } from '@/lib/api';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    is_featured: searchParams.get('is_featured') || '',
    is_new: searchParams.get('is_new') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch filters data (brands & categories)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          apiService.getBrands(),
          apiService.getCategories(),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ...filters,
          page,
        };
        const response = await apiService.getProducts(params);
        
        if (page === 1) {
          setProducts(response.data.results);
        } else {
          setProducts((prev) => [...prev, ...response.data.results]);
        }
        
        setHasMore(response.data.next !== null);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, page]);

  // Reset page when filters change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setProducts([]);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      category: '',
      min_price: '',
      max_price: '',
      is_featured: '',
      is_new: '',
      sort: 'newest',
    });
    setPage(1);
    setProducts([]);
  };

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-2">
              Shop Mattresses
            </h1>
            <p className="text-gray-600">
              {products.length > 0 && `Showing ${products.length} products`}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-darkGray">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-secondary hover:text-orange-600 transition-colors duration-300"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                    />
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quick Filters
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.is_featured === 'true'}
                        onChange={(e) =>
                          handleFilterChange('is_featured', e.target.checked ? 'true' : '')
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured Products</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.is_new === 'true'}
                        onChange={(e) =>
                          handleFilterChange('is_new', e.target.checked ? 'true' : '')
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">New Arrivals</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="lg:w-3/4">
              {/* Sort Bar */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600">
                  {products.length > 0 ? `${products.length} products found` : 'No products found'}
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading && page === 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-96 bg-white rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => {
                      if (products.length === index + 1) {
                        return (
                          <div key={product.id} ref={lastProductRef}>
                            <ProductCard product={product} />
                          </div>
                        );
                      } else {
                        return <ProductCard key={product.id} product={product} />;
                      }
                    })}
                  </div>

                  {/* Loading More */}
                  {loading && page > 1 && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="text-gray-600 mt-2">Loading more products...</p>
                    </div>
                  )}

                  {/* End of Results */}
                  {!hasMore && products.length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You've reached the end!</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}