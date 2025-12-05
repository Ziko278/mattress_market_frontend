// /app/product/[slug]/page.js

import Layout from '@/components/layout/Layout';
import Link from 'next/link';

// --- STATIC GENERATION ---

// This function tells Next.js which product pages to build.
export async function generateStaticParams() {
  try {
    // IMPORTANT: Change '/products/' to your API endpoint that lists all products.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products for static generation');
    }

    const products = await res.json();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for products:', error);
    return [];
  }
}

// This function generates SEO tags for each product page.
export async function generateMetadata({ params }) {
  try {
    // IMPORTANT: Change '/products/slug/' to your API endpoint for a single product.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}/`);
    const product = await res.json();

    return {
      title: product.name,
      description: product.short_description || product.description,
    };
  } catch (error) {
    return {
      title: 'Product',
    };
  }
}

// --- PAGE COMPONENT ---

export default async function ProductDetailPage({ params }) {
  let product = null;

  try {
    // IMPORTANT: Change this URL to your single product API endpoint.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}/`);
    product = await res.json();
  } catch (error) {
    console.error('Error fetching product data:', error);
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-6 md:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-lightGray min-h-screen py-8">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-primary">Products</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={product.featured_image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                    {product.name}
                  </h1>

                  <p className="text-2xl font-semibold text-primary mb-4">
                    ${product.price}
                  </p>

                  <div
                    className="prose max-w-none text-gray-700 mb-6"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />

                  {/* Add to Cart Button or other actions */}
                  <button className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                    Add to Cart
                  </button>

                  {/* Product Meta */}
                  <div className="mt-8 pt-8 border-t space-y-2">
                    <p className="text-gray-600"><strong>SKU:</strong> {product.sku || 'N/A'}</p>
                    <p className="text-gray-600"><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
                    <p className="text-gray-600"><strong>Availability:</strong> <span className="text-green-600 font-semibold">In Stock</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}