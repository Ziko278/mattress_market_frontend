// src/app/admin/blog/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApiService } from '@/lib/adminApi';

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await adminApiService.getBlogPost(postId);
      setPost(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await adminApiService.deleteBlogPost(postId);
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={styles.errorContainer}>
        <span style={styles.errorIcon}>⚠️</span>
        <span>{error || 'Post not found'}</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back to Posts
        </button>
        <div style={styles.headerActions}>
          <Link href={`/admin/blog/${postId}/edit`} style={styles.editButton}>
            ✏️ Edit
          </Link>
          <button onClick={handleDelete} style={styles.deleteButton}>
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div style={styles.content}>
        {/* Featured Image */}
        {post.featured_image && (
          <div style={styles.featuredImage}>
            <img src={post.featured_image?.url || post.featured_image} alt={post.title} style={styles.image} />
          </div>
        )}

        {/* Title */}
        <h1 style={styles.title}>{post.title}</h1>

        {/* Meta Info */}
        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Status:</span>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: post.status === 'active' ? '#10b981' : '#ef4444'
            }}>
              {post.status}
            </span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Category:</span>
            <span style={styles.categoryBadge}>{post.category?.title || 'Uncategorized'}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Views:</span>
            <span>{post.view_count || 0}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Created:</span>
            <span>{new Date(post.created_at).toLocaleString()}</span>
          </div>
          {post.updated_at && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Updated:</span>
              <span>{new Date(post.updated_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={styles.tagsSection}>
            <span style={styles.metaLabel}>Tags:</span>
            <div style={styles.tags}>
              {post.tags.map(tag => (
                <span key={tag.id} style={styles.tag}>
                  {tag.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Excerpt */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Excerpt</h3>
          <p style={styles.excerpt}>{post.excerpt}</p>
        </div>

        {/* Content */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Content</h3>
          <div
            style={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: post.content?.html || '' }}
          />
        </div>

        {/* Comments */}
        {post.comments && post.comments.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Comments ({post.comments.length})</h3>
            <div style={styles.comments}>
              {post.comments.map(comment => (
                <div key={comment.id} style={styles.comment}>
                  <div style={styles.commentHeader}>
                    <strong>{comment.full_name}</strong>
                    <span style={styles.commentDate}>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={styles.commentText}>{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  backButton: { padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  headerActions: { display: 'flex', gap: '10px' },
  editButton: { padding: '8px 16px', backgroundColor: '#1e3a8a', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center' },
  deleteButton: { padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  content: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
  featuredImage: { marginBottom: '30px', borderRadius: '8px', overflow: 'hidden' },
  image: { width: '100%', height: 'auto', display: 'block' },
  title: { fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', lineHeight: '1.2' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  metaLabel: { fontWeight: '600', color: '#6b7280' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', color: 'white' },
  categoryBadge: { padding: '4px 12px', backgroundColor: '#e5e7eb', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  tagsSection: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { padding: '4px 12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  section: { marginBottom: '30px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' },
  excerpt: { fontSize: '16px', lineHeight: '1.6', color: '#4b5563', fontStyle: 'italic' },
  htmlContent: { fontSize: '16px', lineHeight: '1.8', color: '#1f2937' },
  comments: { display: 'flex', flexDirection: 'column', gap: '16px' },
  comment: { padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  commentDate: { fontSize: '12px', color: '#6b7280' },
  commentText: { fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: '1.6' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTop: '4px solid #1e3a8a', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' },
  errorContainer: { display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626' },
  errorIcon: { marginRight: '8px', fontSize: '20px' }
};