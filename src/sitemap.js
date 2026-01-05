// app/sitemap.js

export default async function sitemap() {
  const baseUrl = 'https://www.mattressmarket.ng'; // ⚠️ CHANGE THIS TO YOUR DOMAIN
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-url.com';

  try {
    // ============================================
    // STEP 1: Fetch all products
    // ============================================
    console.log('Fetching products for sitemap...');
    
    const productsResponse = await fetch(`${apiUrl}/products/?limit=500`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const productsData = await productsResponse.json();
    
    // Handle different API response formats
    const products = productsData.results || productsData.data || productsData;

    console.log(`Found ${products.length} products`);

    // Generate product URLs
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // ============================================
    // STEP 2: Fetch all categories (optional)
    // ============================================
    let categoryUrls = [];
    
    try {
      console.log('Fetching categories for sitemap...');
      
      const categoriesResponse = await fetch(`${apiUrl}/categories/`, {
        next: { revalidate: 3600 }
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
        
        console.log(`Found ${categories.length} categories`);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }

    // ============================================
    // STEP 3: Fetch all brands (optional)
    // ============================================
    let brandUrls = [];
    
    try {
      console.log('Fetching brands for sitemap...');
      
      const brandsResponse = await fetch(`${apiUrl}/brands/`, {
        next: { revalidate: 3600 }
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
        
        console.log(`Found ${brands.length} brands`);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }

    // ============================================
    // STEP 4: Define static pages
    // ============================================
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
      // Add more static pages here if you have them
    ];

    // ============================================
    // STEP 5: Combine all URLs
    // ============================================
    const allUrls = [
      ...staticPages,
      ...categoryUrls,
      ...brandUrls,
      ...productUrls
    ];
    
    console.log(`✅ Total sitemap URLs generated: ${allUrls.length}`);
    
    return allUrls;

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    
    // Fallback: Return at least static pages
    return [
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
    ];
  }
}