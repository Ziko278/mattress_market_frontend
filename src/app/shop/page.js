'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/shared/ProductCard';
import { apiService } from '@/lib/api';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  // CORRECTED: Properly defined lastProductRef using useCallback
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

  const filterOffcanvasRef = useRef(null);
  const [bsOffcanvas, setBsOffcanvas] = useState(null);

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

  // Initialize Bootstrap Offcanvas instance from the global window object
  useEffect(() => {
    if (typeof window !== 'undefined' && window.bootstrap) {
      const { Offcanvas } = window.bootstrap;
      const offcanvasElement = filterOffcanvasRef.current;
      if (offcanvasElement) {
        const offcanvas = new Offcanvas(offcanvasElement);
        setBsOffcanvas(offcanvas);
        return () => {
          offcanvas.dispose();
        };
      }
    }
  }, []);

  // Update URL and reset page when filters change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    setProducts([]);

    const queryString = new URLSearchParams(
      Object.entries(newFilters).reduce((acc, [k, v]) => {
        if (v) acc[k] = v;
        return acc;
      }, {})
    ).toString();

    router.push(`/shop${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      brand: '',
      category: '',
      min_price: '',
      max_price: '',
      is_featured: '',
      is_new: '',
      sort: 'newest',
    };
    setFilters(clearedFilters);
    setPage(1);
    setProducts([]);
    router.push('/shop', { scroll: false });
  };

  const openFilters = () => {
    if (bsOffcanvas) {
      bsOffcanvas.show();
    }
  };

  const closeFilters = () => {
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="page-title">
        <div className="container">
          <nav className="d-flex justify-content-between">
            <h1>Shop</h1>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Shop</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Sidebar Filters - Hidden on mobile, visible on desktop */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="sidebar-filter card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Filters</h5>
                  <button onClick={clearFilters} className="btn btn-sm btn-outline-secondary">
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="form-control"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="form-select"
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
                <div className="mb-4">
                  <label className="form-label fw-bold">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="form-select"
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
                <div className="mb-4">
                  <label className="form-label fw-bold">Price Range</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        value={filters.min_price}
                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                        placeholder="Min"
                        className="form-control"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        value={filters.max_price}
                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                        placeholder="Max"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Quick Filters</label>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_featured"
                      checked={filters.is_featured === 'true'}
                      onChange={(e) => handleFilterChange('is_featured', e.target.checked ? 'true' : '')}
                    />
                    <label className="form-check-label" htmlFor="is_featured">
                      Featured Products
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_new"
                      checked={filters.is_new === 'true'}
                      onChange={(e) => handleFilterChange('is_new', e.target.checked ? 'true' : '')}
                    />
                    <label className="form-check-label" htmlFor="is_new">
                      New Arrivals
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="col-lg-9">
            {/* Sort Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                className="btn btn-outline-secondary d-lg-none"
                type="button"
                onClick={openFilters}
              >
                <i className="bi bi-funnel me-2"></i> Filters
              </button>

              <div className="d-flex align-items-center">
                <p className="mb-0 me-3 text-muted">
                  {products.length > 0 ? `${products.length} products found` : 'No products found'}
                </p>
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0 me-2 text-muted">Sort by:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading && page === 1 ? (
              <div className="row g-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="col-sm-6 col-lg-4">
                    <div className="placeholder-glow">
                      <div className="placeholder card" style={{ height: '350px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="row g-4">
                  {products.map((product, index) => {
                    if (products.length === index + 1) {
                      return (
                        <div key={product.id} ref={lastProductRef} className="col-sm-6 col-lg-4">
                          <ProductCard product={product} />
                        </div>
                      );
                    } else {
                      return (
                        <div key={product.id} className="col-sm-6 col-lg-4">
                          <ProductCard product={product} />
                        </div>
                      );
                    }
                  })}
                </div>

                {/* Loading More */}
                {loading && page > 1 && (
                  <div className="text-center py-8">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading more products...</p>
                  </div>
                )}

                {/* End of Results */}
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted">You've reached the end of the results!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="mb-4" style={{ fontSize: '4rem' }}>🔍</div>
                <h3 className="h3 mb-2">No products found</h3>
                <p className="text-muted mb-6">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Offcanvas */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="filterOffcanvas"
        aria-labelledby="filterOffcanvasLabel"
        ref={filterOffcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="filterOffcanvasLabel">Filters</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeFilters}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* Search */}
          <div className="mb-4">
            <label className="form-label fw-bold">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search products..."
              className="form-control"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="form-label fw-bold">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
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
          <div className="mb-4">
            <label className="form-label fw-bold">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="form-select"
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
          <div className="mb-4">
            <label className="form-label fw-bold">Price Range</label>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  placeholder="Min"
                  className="form-control"
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  placeholder="Max"
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-4">
            <label className="form-label fw-bold">Quick Filters</label>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="is_featured_mobile"
                checked={filters.is_featured === 'true'}
                onChange={(e) => handleFilterChange('is_featured', e.target.checked ? 'true' : '')}
              />
              <label className="form-check-label" htmlFor="is_featured_mobile">
                Featured Products
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="is_new_mobile"
                checked={filters.is_new === 'true'}
                onChange={(e) => handleFilterChange('is_new', e.target.checked ? 'true' : '')}
              />
              <label className="form-check-label" htmlFor="is_new_mobile">
                New Arrivals
              </label>
            </div>
          </div>

          <button onClick={clearFilters} className="btn btn-outline-secondary w-100">
            Clear All
          </button>
        </div>
      </div>
    </Layout>
  );
}


// export default function ShopPage() {
//   return (
//     <div style={{ padding: '50px', textAlign: 'center' }}>
//       <h1>Shop Page</h1>
//       <p>If this builds, the problem was in the old component.</p>
//     </div>
//   );
// }