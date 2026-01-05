// app/sitemap.js

// Import your API configuration
import { API_BASE_URL } from '@/lib/constants';

export default async function sitemap() {
  const baseUrl = 'https://www.mattressmarket.ng';
  const apiUrl = API_BASE_URL; // Using your constants file

  // Log for debugging
  console.log('🔍 Generating sitemap...');
  console.log('API URL:', apiUrl);

  // Define static pages first (these will always work)
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
    // Fetch products with timeout
    console.log('Fetching products from:', `${apiUrl}/products/`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const productsResponse = await fetch(`${apiUrl}/products/?limit=500`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache during build
    });

    clearTimeout(timeoutId);

    if (!productsResponse.ok) {
      throw new Error(`HTTP error! status: ${productsResponse.status}`);
    }

    const productsData = await productsResponse.json();
    const products = productsData.results || productsData.data || productsData;

    console.log(`✅ Found ${products.length} products`);

    // Generate product URLs
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Try to fetch categories (optional - won't fail sitemap if it errors)
    let categoryUrls = [];
    try {
      const categoriesResponse = await fetch(`${apiUrl}/categories/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        const categories = categoriesData.results || categoriesData.data || categoriesData;
        
        categoryUrls = categories.map((category) => ({
          url: `${baseUrl}/shop?category=${category.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        
        console.log(`✅ Found ${categories.length} categories`);
      }
    } catch (error) {
      console.warn('⚠️ Categories fetch failed:', error.message);
    }

    // Try to fetch brands (optional)
    let brandUrls = [];
    try {
      const brandsResponse = await fetch(`${apiUrl}/brands/`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json();
        const brands = brandsData.results || brandsData.data || brandsData;
        
        brandUrls = brands.map((brand) => ({
          url: `${baseUrl}/shop?brand=${brand.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        
        console.log(`✅ Found ${brands.length} brands`);
      }
    } catch (error) {
      console.warn('⚠️ Brands fetch failed:', error.message);
    }

    const allUrls = [...staticPages, ...categoryUrls, ...brandUrls, ...productUrls];
    console.log(`✅ Total sitemap URLs: ${allUrls.length}`);
    
    return allUrls;

  } catch (error) {
    console.error('❌ Error generating dynamic sitemap:', error);
    console.log('Returning static pages only as fallback');
    
    // Return static pages as fallback
    return staticPages;
  }
}

// Set revalidation time (in seconds)
export const revalidate = 3600; // Revalidate every hour