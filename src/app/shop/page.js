import Layout from '@/components/layout/Layout';
import ShopContent from '@/components/shop/ShopContent';

export async function generateMetadata({ searchParams }) {
  // Build title parts
  let titleParts = ["Mattress Market - Shop"];

  if (searchParams.brand) {
    titleParts.push(searchParams.brand);
  }
  if (searchParams.category) {
    titleParts.push(searchParams.category);
  }
  if (searchParams.size) {
    titleParts.push(searchParams.size);
  }
  if (searchParams.search) {
    titleParts.push(searchParams.search);
  }

  const title = titleParts.join(" | ");

  return {
    title,
    description: 'Browse our complete collection of premium mattresses from top brands including Mouka, Vitafoam, and more. Quality mattresses with fast delivery in Abuja and across Nigeria.',
    keywords: 'buy mattress online nigeria, mattress shop abuja, mouka mattress, vitafoam mattress, premium mattresses nigeria',
    openGraph: {
      title,
      description: 'Browse our complete collection of premium mattresses from top brands. Quality mattresses with fast delivery across Nigeria.',
      url: 'https://www.mattressmarket.ng/shop',
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
      description: 'Browse our complete collection of premium mattresses from top brands.',
      images: ['https://www.mattressmarket.ng/images/main.jpg'],
    },
    alternates: {
      canonical: 'https://www.mattressmarket.ng/shop',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
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