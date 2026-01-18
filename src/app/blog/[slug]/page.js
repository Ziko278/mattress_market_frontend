'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import CommentForm from './CommentForm';
import { apiService } from '@/lib/api';

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const [postRes, recentRes] = await Promise.all([
          apiService.getBlogPost(params.slug),
          apiService.getRecentPosts()
        ]);
        setPost(postRes.data);
        setRecentPosts(recentRes.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlogPost();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="placeholder-glow">
            <div className="placeholder bg-secondary mb-3" style={{ height: '400px', width: '100%' }}></div>
            <div className="placeholder col-8 mb-2"></div>
            <div className="placeholder col-6 mb-4"></div>
            <div className="placeholder col-12 mb-2"></div>
            <div className="placeholder col-12 mb-2"></div>
            <div className="placeholder col-10"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h1 className="mb-4">Blog Post Not Found</h1>
          <a href="/blog" className="btn btn-primary">Back to Blog</a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="page-title">
        <div className="container">
          <nav className="d-flex justify-content-between">
            <h1>Blog</h1>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/blog">Blog</a></li>
              <li className="breadcrumb-item active">{post.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-4">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="img-fluid rounded shadow-sm w-100"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Article Header */}
            <article className="blog-post">
              <header className="mb-4">
                <h1 className="display-5 fw-bold mb-3">{post.title}</h1>

                {/* Meta Info */}
                <div className="d-flex flex-wrap align-items-center gap-3 text-muted mb-3">
                  <span>
                    <i className="bi bi-calendar3 me-2"></i>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    <i className="bi bi-folder me-2"></i>
                    <a href={`/blog?category=${post.category?.slug}`} className="text-decoration-none">
                      {post.category?.title || 'Uncategorized'}
                    </a>
                  </span>
                  <span>
                    <i className="bi bi-eye me-2"></i>
                    {post.view_count || 0} views
                  </span>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="badge bg-primary">
                        {tag.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="lead text-muted fst-italic border-start border-4 border-primary ps-3 mb-4">
                    {post.excerpt}
                  </p>
                )}
              </header>

              {/* Content */}
              <div className="blog-content mb-5">
                {post.content?.html ? (
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: post.content.html }}
                  />
                ) : (
                  <div className="prose">
                    {typeof post.content === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <p>No content available.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Share Buttons */}
              <div className="border-top border-bottom py-4 mb-5">
                <h5 className="mb-3">Share this post:</h5>
                <div className="d-flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-facebook me-2"></i>Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info"
                  >
                    <i className="bi bi-twitter me-2"></i>Twitter
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success"
                  >
                    <i className="bi bi-whatsapp me-2"></i>WhatsApp
                  </a>
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h3 className="mb-4">
                  Comments ({post.comments ? post.comments.length : 0})
                </h3>

                {/* Existing Comments */}
                {post.comments && post.comments.length > 0 ? (
                  <div className="mb-5">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="card mb-3 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 fw-bold">{comment.full_name}</h6>
                            <small className="text-muted">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-0 text-muted">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-4">No comments yet. Be the first to comment!</p>
                )}

                {/* Comment Form */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h4 className="mb-4">Leave a Comment</h4>
                    <CommentForm postId={post.id} />
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-4">Recent Posts</h5>
                  <div className="d-flex flex-column gap-3">
                    {recentPosts.map((recentPost) => (
                      <a
                        key={recentPost.id}
                        href={`/blog/${recentPost.slug}`}
                        className="text-decoration-none"
                      >
                        <div className="d-flex gap-3">
                          {recentPost.featured_image && (
                            <img
                              src={recentPost.featured_image}
                              alt={recentPost.title}
                              className="rounded"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-dark">{recentPost.title}</h6>
                            <small className="text-muted">
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(recentPost.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Categories Widget */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Categories</h5>
                <div className="d-flex flex-column gap-2">
                  <a href="/blog" className="text-decoration-none text-dark d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span>All Posts</span>
                    <i className="bi bi-arrow-right"></i>
                  </a>
                  {post.category && (
                    <a href={`/blog?category=${post.category.slug}`} className="text-decoration-none text-dark d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span>{post.category.title}</span>
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="card border-0 shadow-sm bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">Newsletter</h5>
                <p className="mb-3">Subscribe to get the latest mattress tips and news!</p>
                <form>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-light w-100">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #374151;
        }

        .blog-content :global(h1),
        .blog-content :global(h2),
        .blog-content :global(h3),
        .blog-content :global(h4),
        .blog-content :global(h5),
        .blog-content :global(h6) {
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .blog-content :global(p) {
          margin-bottom: 1.5rem;
        }

        .blog-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .blog-content :global(ul),
        .blog-content :global(ol) {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .blog-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .blog-content :global(blockquote) {
          border-left: 4px solid #1e3a8a;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .blog-content :global(a) {
          color: #1e3a8a;
          text-decoration: underline;
        }

        .blog-content :global(a:hover) {
          color: #1e40af;
        }

        .blog-content :global(code) {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .blog-content :global(pre) {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .blog-content :global(pre code) {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
      `}</style>
    </Layout>
  );
}