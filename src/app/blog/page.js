'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { apiService } from '@/lib/api';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
  });

  const observer = useRef();
  const lastPostRef = useCallback(
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getBlogCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page };
        const response = await apiService.getBlogPosts(params);

        if (page === 1) {
          setPosts(response.data.results);
        } else {
          setPosts((prev) => [...prev, ...response.data.results]);
        }

        setHasMore(response.data.next !== null);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setPosts([]);
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Sleep tips, product guides, and industry insights
            </p>
          </div>
        </div>

        {/* Blog Content */}
        <section className="py-16 bg-lightGray">
          <div className="container mx-auto px-6 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-1/4">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search Posts
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search articles..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-lg font-bold text-darkGray mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFilterChange('category', '')}
                        className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                          filters.category === ''
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-lightGray'
                        }`}
                      >
                        All Posts
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleFilterChange('category', cat.id)}
                          className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                            filters.category === cat.id.toString()
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-lightGray'
                          }`}
                        >
                          {cat.title} ({cat.post_count || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Posts Grid */}
              <main className="lg:w-3/4">
                {loading && page === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-96 bg-white rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {posts.map((post, index) => {
                        if (posts.length === index + 1) {
                          return (
                            <div key={post.id} ref={lastPostRef}>
                              <BlogPostCard post={post} />
                            </div>
                          );
                        } else {
                          return <BlogPostCard key={post.id} post={post} />;
                        }
                      })}
                    </div>

                    {loading && page > 1 && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-gray-600 mt-2">Loading more posts...</p>
                      </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">You've reached the end!</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts found</h3>
                    <p className="text-gray-600">Try adjusting your filters</p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function BlogPostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Featured Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={post.featured_image || '/placeholder-blog.jpg'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category_name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
            <span>👁️ {post.view_count} views</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <span className="text-primary font-semibold group-hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}