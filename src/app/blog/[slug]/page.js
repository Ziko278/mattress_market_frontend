// Import necessary components and functions
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { apiService } from '@/lib/api'; // Ensure this can run on the server
import CommentForm from './CommentForm'; // We will create this next

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    // IMPORTANT: You need an API endpoint to fetch all post slugs.
    // Assuming `apiService.getAllPosts()` returns an array of posts with a 'slug' field.
    // If you don't have this, create one in your Django backend.
    const postsResponse = await apiService.getAllPosts();
    
    // If getAllPosts() doesn't exist, you might need to create it or use a fetch call:
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/`);
    // const posts = await res.json();

    return postsResponse.data.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog:', error);
    // Return an empty array to prevent the build from failing,
    // but no pages will be generated.
    return [];
  }
}

// Generate metadata for each page (great for SEO)
export async function generateMetadata({ params }) {
  try {
    const postResponse = await apiService.getBlogPost(params.slug);
    const post = postResponse.data;

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.featured_image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post',
    };
  }
}

// The main page component is now an async Server Component
export default async function BlogDetailPage({ params }) {
  let post = null;
  let recentPosts = [];

  try {
    // Fetch data in parallel on the server before rendering
    const [postResponse, recentResponse] = await Promise.all([
      apiService.getBlogPost(params.slug),
      apiService.getRecentPosts(),
    ]);
    post = postResponse.data;
    recentPosts = recentResponse.data;
  } catch (error) {
    console.error('Error fetching post data:', error);
  }

  // Handle 404 case if post is not found
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors duration-300">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-primary transition-colors duration-300">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>

            {/* Post Header */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="mb-4">
                <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full">
                  {post.category.title}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-gray-600 mb-6">
                <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                <span>👁️ {post.view_count} views</span>
                <span>💬 {post.comments.length} comments</span>
              </div>

              {/* Featured Image */}
              <div className="rounded-xl overflow-hidden mb-6">
                <img
                  src={post.featured_image || '/placeholder-blog.jpg'}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Excerpt */}
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">{post.excerpt}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-lightGray text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <div className="prose max-w-none">
                {/* NOTE: Your original content rendering was basic.
                  If `post.content` is a rich JSON from a editor like TipTap,
                  you'll need a dedicated renderer component here. */}
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="text-gray-700 leading-relaxed"
                />
              </div>

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-bold text-darkGray mb-4">Share this post:</h3>
                <div className="flex gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                    📘 Facebook
                  </button>
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                    🐦 Twitter
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-darkGray mb-6">
                Comments ({post.comments.length})
              </h2>

              {/* Display Comments */}
              {post.comments.length > 0 ? (
                <div className="space-y-6 mb-8">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          {comment.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{comment.full_name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-13">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-8">
                  No comments yet. Be the first to comment!
                </p>
              )}

              {/* Comment Form - Now a separate Client Component */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-bold text-darkGray mb-4">Leave a Comment</h3>
                <CommentForm postId={post.id} />
              </div>
            </div>

            {/* Related Posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-darkGray mb-6">Recent Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentPosts.slice(0, 3).map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group">
                        <div className="rounded-lg overflow-hidden mb-3">
                          <img
                            src={relatedPost.featured_image || '/placeholder-blog.jpg'}
                            alt={relatedPost.title}
                            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(relatedPost.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}