'use client';

import { useState } from 'react';
import { apiService } from '@/lib/api'; // This client-side import is fine

export default function CommentForm({ postId }) {
  const [commentForm, setCommentForm] = useState({
    full_name: '',
    email: '',
    comment: '',
  });
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentSubmitting(true);

    try {
      await apiService.createComment({
        ...commentForm,
        post: postId, // Use the postId passed from the parent
      });
      alert('Comment submitted for approval!');
      setCommentForm({
        full_name: '',
        email: '',
        comment: '',
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={commentForm.full_name}
            onChange={(e) =>
              setCommentForm({ ...commentForm, full_name: e.target.value })
            }
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={commentForm.email}
            onChange={(e) =>
              setCommentForm({ ...commentForm, email: e.target.value })
            }
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Comment *
        </label>
        <textarea
          value={commentForm.comment}
          onChange={(e) =>
            setCommentForm({ ...commentForm, comment: e.target.value })
          }
          required
          rows="4"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={commentSubmitting}
        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
          commentSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-blue-900'
        }`}
      >
        {commentSubmitting ? 'Submitting...' : 'Post Comment'}
      </button>
    </form>
  );
}