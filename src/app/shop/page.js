import Layout from '@/components/layout/Layout';
import ShopContent from '@/components/shop/ShopContent';

export async function generateMetadata({ searchParams }) {
  // Build canonical URL based on filters
  let canonicalUrl = 'https://www.mattressmarket.ng/shop';
  const params = new URLSearchParams();

  // Add filters to canonical URL in a consistent order
  if (searchParams.brand) {
    params.append('brand', searchParams.brand);
  }
  if (searchParams.category) {
    params.append('category', searchParams.category);
  }
  if (searchParams.size) {
    params.append('size', searchParams.size);
  }

  // Build the canonical with parameters (exclude search to avoid indexing every search term)
  if (params.toString()) {
    canonicalUrl += `?${params.toString()}`;
  }

  // Build title parts
  let titleParts = [];

  if (searchParams.brand) {
    titleParts.push(searchParams.brand);
  }
  if (searchParams.category) {
    titleParts.push(searchParams.category);
  }
  if (searchParams.size) {
    titleParts.push(`${searchParams.size} Size`);
  }

  const title = titleParts.length > 0
    ? `${titleParts.join(" | ")} Mattresses - MattressMarket Abuja`
    : "Shop Premium Mattresses - MattressMarket Abuja";

  // Build description based on filters
  let description = 'Browse our complete collection of premium mattresses from top brands including Mouka, Vitafoam, and more.';

  if (searchParams.brand && searchParams.category) {
    description = `Shop ${searchParams.brand} ${searchParams.category} mattresses. Quality mattresses with fast delivery in Abuja and across Nigeria.`;
  } else if (searchParams.brand) {
    description = `Shop genuine ${searchParams.brand} mattresses. Premium quality with fast delivery in Abuja and across Nigeria.`;
  } else if (searchParams.category) {
    description = `Browse our ${searchParams.category} collection. Premium mattresses with fast delivery in Abuja and across Nigeria.`;
  }

  return {
    title,
    description,
    keywords: 'buy mattress online nigeria, mattress shop abuja, mouka mattress, vitafoam mattress, premium mattresses nigeria',
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'MattressMarket Nigeria',
      images: [
        {
          url: 'https://www.mattressmarket.ng/images/main.jpg',
          width: 1200,
          height: 630,
          alt: 'MattressMarket Shop',
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.mattressmarket.ng/images/main.jpg'],
    },
    alternates: {
      canonical: canonicalUrl, // Each filtered page gets its own canonical
    },
    robots: {
      // Don't index search queries, but index brand/category/size filters
      index: !searchParams.search,
      follow: true,
      googleBot: {
        index: !searchParams.search,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function ShopPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shop Mattresses",
    "image": "https://www.mattressmarket.ng/images/main.jpg",
    "description": "Browse our complete collection of premium mattresses from top brands."
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ShopContent />
    </Layout>
  );
}