// src/app/sitemap.js

// Import your API configuration
import { API_BASE_URL } from '@/lib/constants';

export default async function sitemap() {
  const baseUrl = 'https://www.mattressmarket.ng';
  const apiUrl = API_BASE_URL;

  console.log('🔍 Generating sitemap...');
  console.log('API URL:', apiUrl);

  // Define static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/buyers-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  try {
    // ============================================
    // FETCH ALL PRODUCTS
    // ============================================
    console.log('📦 Fetching all products...');

    const productsResponse = await fetch(`${apiUrl}/products/?all=true`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!productsResponse.ok) {
      throw new Error(`Products HTTP error! status: ${productsResponse.status}`);
    }

    const products = await productsResponse.json();

    console.log(`✅ Total products fetched: ${products.length}`);

    // Remove duplicates based on slug
    const uniqueProducts = Array.from(
      new Map(products.map(item => [item.slug, item])).values()
    );

    if (uniqueProducts.length !== products.length) {
      console.warn(`⚠️ Removed ${products.length - uniqueProducts.length} duplicate products`);
    }

    // Generate product URLs
    const productUrls = uniqueProducts.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // ============================================
    // FETCH ALL BLOG POSTS
    // ============================================
    let blogUrls = [];
    try {
      console.log('📝 Fetching blog posts...');
      const blogResponse = await fetch(`${apiUrl}/blog/posts/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        // Handle both paginated and non-paginated responses
        const blogPosts = blogData.results || blogData;

        blogUrls = blogPosts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));

        console.log(`✅ Found ${blogPosts.length} blog posts`);
      }
    } catch (error) {
      console.warn('⚠️ Blog posts fetch failed:', error.message);
    }

    // ============================================
    // FETCH ALL BLOG CATEGORIES
    // ============================================
    let blogCategoryUrls = [];
    try {
      console.log('📂 Fetching blog categories...');
      const blogCategoriesResponse = await fetch(`${apiUrl}/blog/categories/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (blogCategoriesResponse.ok) {
        const blogCategories = await blogCategoriesResponse.json();

        blogCategoryUrls = blogCategories.map((category) => ({
          url: `${baseUrl}/blog?category=${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        }));

        console.log(`✅ Found ${blogCategories.length} blog categories`);
      }
    } catch (error) {
      console.warn('⚠️ Blog categories fetch failed:', error.message);
    }

    // ============================================
    // FETCH ALL PRODUCT CATEGORIES
    // ============================================
    let categoryUrls = [];
    try {
      console.log('📂 Fetching product categories...');
      const categoriesResponse = await fetch(`${apiUrl}/products/categories/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();

        categoryUrls = categories.map((category) => ({
          url: `${baseUrl}/shop?category=${encodeURIComponent(category.title)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));

        console.log(`✅ Found ${categories.length} product categories`);
      }
    } catch (error) {
      console.warn('⚠️ Product categories fetch failed:', error.message);
    }

    // ============================================
    // FETCH ALL BRANDS
    // ============================================
    let brandUrls = [];
    try {
      console.log('🏷️ Fetching brands...');
      const brandsResponse = await fetch(`${apiUrl}/products/brands/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (brandsResponse.ok) {
        const brands = await brandsResponse.json();

        brandUrls = brands.map((brand) => ({
          url: `${baseUrl}/shop?brand=${encodeURIComponent(brand.name)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));

        console.log(`✅ Found ${brands.length} brands`);
      }
    } catch (error) {
      console.warn('⚠️ Brands fetch failed:', error.message);
    }

    // ============================================
    // COMBINE ALL URLs
    // ============================================
    const allUrls = [
      ...staticPages,
      ...categoryUrls,
      ...brandUrls,
      ...productUrls,
      ...blogUrls,
      ...blogCategoryUrls
    ];

    console.log('═══════════════════════════════════════');
    console.log(`✅ TOTAL SITEMAP URLs: ${allUrls.length}`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Product categories: ${categoryUrls.length}`);
    console.log(`   - Brands: ${brandUrls.length}`);
    console.log(`   - Products: ${productUrls.length}`);
    console.log(`   - Blog posts: ${blogUrls.length}`);
    console.log(`   - Blog categories: ${blogCategoryUrls.length}`);
    console.log('═══════════════════════════════════════');

    return allUrls;

  } catch (error) {
    console.error('❌ Error generating dynamic sitemap:', error);
    console.log('Returning static pages only as fallback');

    return staticPages;
  }
}

// Set revalidation time (in seconds)
export const revalidate = 3600; // Revalidate every hour