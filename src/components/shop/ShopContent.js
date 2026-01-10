'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard';
import { apiService } from '@/lib/api';

function ShopContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [weights, setWeights] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    weight: searchParams.get('weight') || '',
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

  const filterOffcanvasRef = useRef(null);
  const [bsOffcanvas, setBsOffcanvas] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandsRes, categoriesRes, weightsRes] = await Promise.all([
          apiService.getBrands(),
          apiService.getCategories(),
          apiService.getWeights(),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setWeights(weightsRes.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

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
      weight: '',
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
    <>
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
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="sidebar-filter card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Filters</h5>
                  <button onClick={clearFilters} className="btn btn-sm btn-outline-secondary">
                    Clear All
                  </button>
                </div>

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

                <div className="mb-4">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Weight</label>
                  <select
                    value={filters.weight}
                    onChange={(e) => handleFilterChange('weight', e.target.value)}
                    className="form-select"
                  >
                    <option value="">All Weights</option>
                    {weights.map((weight) => (
                      <option key={weight.id} value={weight.weight}>
                        {weight.weight}
                      </option>
                    ))}
                  </select>
                </div>

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

          <main className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                className="btn btn-outline-secondary d-lg-none"
                type="button"
                onClick={openFilters}
              >
                <i className="bi bi-funnel me-2"></i> Filters
              </button>

              <div className="d-flex align-items-center">
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

                {loading && page > 1 && (
                  <div className="text-center py-8">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading more products...</p>
                  </div>
                )}

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

          <div className="mb-4">
            <label className="form-label fw-bold">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="form-select"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Weight</label>
            <select
              value={filters.weight}
              onChange={(e) => handleFilterChange('weight', e.target.value)}
              className="form-select"
            >
              <option value="">All Weights</option>
              {weights.map((weight) => (
                <option key={weight.id} value={weight.weight}>
                  {weight.weight}
                </option>
              ))}
            </select>
          </div>

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
    </>
  );
}

export default function ShopContent() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 md:px-8 py-16 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading shop...</p>
      </div>
    }>
      <ShopContentInner />
    </Suspense>
  );
}