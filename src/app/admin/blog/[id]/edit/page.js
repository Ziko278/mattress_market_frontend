// src/app/admin/blog/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApiService } from '@/lib/adminApi';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  { ssr: false }
);

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    featured_image: null,
    status: 'active'
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await adminApiService.getBlogPost(postId);
      const post = response.data;

      setFormData({
        title: post.title || '',
        category: post.category?.id || '',
        excerpt: post.excerpt || '',
        content: post.content?.html || '',
        featured_image: null,
        status: post.status || 'active'
      });

      setSelectedTags(post.tags?.map(tag => tag.id) || []);
      setExistingImageUrl(post.featured_image || '');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminApiService.getBlogCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await adminApiService.getBlogTags();
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setExistingImageUrl(''); // Clear existing image preview
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleContentChange = (htmlContent) => {
    setFormData(prev => ({ ...prev, content: htmlContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();

      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('excerpt', formData.excerpt);

      const contentJson = JSON.stringify({
        type: 'html',
        html: formData.content
      });
      submitData.append('content', contentJson);
      submitData.append('status', formData.status);

      if (formData.featured_image) {
        submitData.append('featured_image', formData.featured_image);
      }

      selectedTags.forEach(tagId => {
        submitData.append('tags', tagId);
      });

      await adminApiService.updateBlogPost(postId, submitData);
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.detail || 'Failed to update post');
    } finally {
      setSubmitting(false);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Edit Blog Post</h1>
        <button
          type="button"
          onClick={() => router.back()}
          style={styles.backButton}
        >
          ← Back to Posts
        </button>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          <div style={styles.mainContent}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Content *</label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>
          </div>

          <div style={styles.sidebar}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Featured Image</h3>
              <div style={styles.imageUpload}>
                {formData.featured_image || existingImageUrl ? (
                  <div style={styles.imagePreview}>
                    <img
                      src={formData.featured_image ? URL.createObjectURL(formData.featured_image) : existingImageUrl}
                      alt="Preview"
                      style={styles.previewImg}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, featured_image: null }));
                        setExistingImageUrl('');
                      }}
                      style={styles.removeImage}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadLabel}>
                    <input
                      type="file"
                      name="featured_image"
                      onChange={handleChange}
                      accept="image/*"
                      style={styles.fileInput}
                    />
                    <span style={styles.uploadText}>📷 Upload Image</span>
                  </label>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Category *</h3>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Tags</h3>
              <div style={styles.tagList}>
                {tags.map(tag => (
                  <label key={tag.id} style={styles.tagLabel}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      style={styles.tagCheckbox}
                    />
                    <span style={styles.tagName}>{tag.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Status</h3>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitButton,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#1f2937' },
  backButton: { padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  errorContainer: { display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '20px' },
  errorIcon: { marginRight: '8px', fontSize: '18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' },
  mainContent: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' },
  textarea: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' },
  cardTitle: { fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#1f2937' },
  imageUpload: { display: 'flex', flexDirection: 'column', gap: '10px' },
  imagePreview: { position: 'relative', width: '100%', height: '200px', borderRadius: '6px', overflow: 'hidden' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  removeImage: { position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' },
  uploadLabel: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', border: '2px dashed #e5e7eb', borderRadius: '6px', cursor: 'pointer' },
  fileInput: { display: 'none' },
  uploadText: { fontSize: '14px', color: '#6b7280' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white' },
  tagList: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagLabel: { display: 'flex', alignItems: 'center', padding: '6px 12px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '20px', cursor: 'pointer' },
  tagCheckbox: { marginRight: '6px' },
  tagName: { fontSize: '13px', color: '#374151' },
  submitButton: { padding: '12px 24px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTop: '4px solid #1e3a8a', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }
};