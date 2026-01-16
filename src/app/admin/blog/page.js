// src/app/admin/blog/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApiService } from '@/lib/adminApi';

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await adminApiService.getBlogPosts(params);
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await adminApiService.deleteBlogPost(postId);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <span style={styles.errorIcon}>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Blog Posts</h1>
        <Link href="/admin/blog/new" style={styles.addButton}>
          <span style={styles.addIcon}>+</span>
          Create New Post
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          🔍
        </button>
      </form>

      {/* Posts Table */}
      <div style={styles.tableContainer}>
        {posts.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Title</th>
                <th style={styles.tableHeaderCell}>Category</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Views</th>
                <th style={styles.tableHeaderCell}>Created</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.postTitle}>{post.title}</div>
                    <div style={styles.postExcerpt}>
                      {post.excerpt?.substring(0, 100)}
                      {post.excerpt?.length > 100 ? '...' : ''}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.categoryBadge}>
                      {post.category?.title || 'Uncategorized'}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: post.status === 'active' ? '#10b981' : '#ef4444'
                    }}>
                      {post.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{post.view_count || 0}</td>
                  <td style={styles.tableCell}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        style={styles.viewButton}
                        title="View Details"
                      >
                        👁️
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        style={styles.editButton}
                        title="Edit Post"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        style={styles.deleteButton}
                        title="Delete Post"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📝</span>
            <p style={styles.emptyText}>No blog posts found</p>
            <Link href="/admin/blog/new" style={styles.emptyLink}>
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#1f2937' },
  addButton: { display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#1e3a8a', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500' },
  addIcon: { marginRight: '8px', fontSize: '18px' },
  searchForm: { display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '400px' },
  searchInput: { flex: 1, padding: '10px 15px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
  searchButton: { padding: '10px 15px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
  tableContainer: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f9fafb' },
  tableHeaderCell: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableRow: { borderTop: '1px solid #e5e7eb' },
  tableCell: { padding: '16px', fontSize: '14px', color: '#1f2937' },
  postTitle: { fontWeight: '600', marginBottom: '4px' },
  postExcerpt: { fontSize: '12px', color: '#6b7280', lineHeight: '1.4' },
  categoryBadge: { display: 'inline-block', padding: '4px 8px', backgroundColor: '#e5e7eb', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
  statusBadge: { display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', color: 'white' },
  actionButtons: { display: 'flex', gap: '6px' },
  viewButton: { padding: '6px 10px', backgroundColor: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' },
  editButton: { padding: '6px 10px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' },
  deleteButton: { padding: '6px 10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: '16px' },
  emptyText: { fontSize: '16px', color: '#6b7280', marginBottom: '16px' },
  emptyLink: { display: 'inline-block', padding: '10px 20px', backgroundColor: '#1e3a8a', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '14px' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTop: '4px solid #1e3a8a', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' },
  errorContainer: { display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626' },
  errorIcon: { marginRight: '8px', fontSize: '20px' }
};