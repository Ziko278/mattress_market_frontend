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
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // ============================================
    // FETCH ALL PRODUCTS IN ONE REQUEST
    // ============================================
    console.log('📦 Fetching all products...');
    
    // Use ?all=true to get all products without pagination
    const productsResponse = await fetch(`${apiUrl}/products/?all=true`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!productsResponse.ok) {
      throw new Error(`HTTP error! status: ${productsResponse.status}`);
    }

    const products = await productsResponse.json();
    
    console.log(`✅ Total products fetched: ${products.length}`);

    // Remove duplicates based on slug (just in case)
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
    // FETCH ALL CATEGORIES
    // ============================================
    let categoryUrls = [];
    try {
      console.log('📂 Fetching categories...');
      const categoriesResponse = await fetch(`${apiUrl}/categories/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        
        categoryUrls = categories.map((category) => ({
          url: `${baseUrl}/shop?category=${category.title}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        
        console.log(`✅ Found ${categories.length} categories`);
      }
    } catch (error) {
      console.warn('⚠️ Categories fetch failed:', error.message);
    }

    // ============================================
    // FETCH ALL BRANDS
    // ============================================
    let brandUrls = [];
    try {
      console.log('🏷️ Fetching brands...');
      const brandsResponse = await fetch(`${apiUrl}/brands/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (brandsResponse.ok) {
        const brands = await brandsResponse.json();
        
        brandUrls = brands.map((brand) => ({
          url: `${baseUrl}/shop?brand=${brand.name}`,
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
    const allUrls = [...staticPages, ...categoryUrls, ...brandUrls, ...productUrls];
    
    console.log('═══════════════════════════════════════');
    console.log(`✅ TOTAL SITEMAP URLs: ${allUrls.length}`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Categories: ${categoryUrls.length}`);
    console.log(`   - Brands: ${brandUrls.length}`);
    console.log(`   - Products: ${productUrls.length}`);
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