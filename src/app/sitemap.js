// src/app/sitemap.js

// Import your API configuration
import { API_BASE_URL } from '@/lib/constants';

// Function to fetch all products (handle pagination)
async function fetchAllProducts(apiUrl) {
  let allProducts = [];
  let nextUrl = `${apiUrl}/products/?limit=100`; // Fetch 100 at a time
  
  while (nextUrl) {
    console.log('Fetching:', nextUrl);
    
    const response = await fetch(nextUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add products from this page
    const products = data.results || data.data || data;
    allProducts = [...allProducts, ...products];
    
    // Check if there's a next page
    nextUrl = data.next || null;
    
    console.log(`Fetched ${products.length} products. Total so far: ${allProducts.length}`);
  }
  
  return allProducts;
}

// Function to fetch all items (generic pagination handler)
async function fetchAllItems(url) {
  let allItems = [];
  let nextUrl = url;
  
  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) break;
    
    const data = await response.json();
    const items = data.results || data.data || data;
    allItems = [...allItems, ...items];
    
    nextUrl = data.next || null;
  }
  
  return allItems;
}

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
    // Fetch ALL products (handle pagination)
    console.log('📦 Fetching all products...');
    const products = await fetchAllProducts(apiUrl);
    console.log(`✅ Total products fetched: ${products.length}`);

    // Generate product URLs
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Fetch all categories
    let categoryUrls = [];
    try {
      console.log('📂 Fetching categories...');
      const categories = await fetchAllItems(`${apiUrl}/categories/`);
      
      categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/shop?category=${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      
      console.log(`✅ Found ${categories.length} categories`);
    } catch (error) {
      console.warn('⚠️ Categories fetch failed:', error.message);
    }

    // Fetch all brands
    let brandUrls = [];
    try {
      console.log('🏷️ Fetching brands...');
      const brands = await fetchAllItems(`${apiUrl}/brands/`);
      
      brandUrls = brands.map((brand) => ({
        url: `${baseUrl}/shop?brand=${brand.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      
      console.log(`✅ Found ${brands.length} brands`);
    } catch (error) {
      console.warn('⚠️ Brands fetch failed:', error.message);
    }

    // Combine all URLs
    const allUrls = [...staticPages, ...categoryUrls, ...brandUrls, ...productUrls];
    console.log(`✅ TOTAL SITEMAP URLs: ${allUrls.length}`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Categories: ${categoryUrls.length}`);
    console.log(`   - Brands: ${brandUrls.length}`);
    console.log(`   - Products: ${productUrls.length}`);
    
    return allUrls;

  } catch (error) {
    console.error('❌ Error generating dynamic sitemap:', error);
    console.log('Returning static pages only as fallback');
    
    return staticPages;
  }
}

// Set revalidation time (in seconds)
export const revalidate = 3600; // Revalidate every hour