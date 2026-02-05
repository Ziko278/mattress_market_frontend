import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import WhyBuyFromUs from '@/components/home/WhyBuyFromUs';
import ShopByCategory from '@/components/home/ShopByCategory';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import BrandShowcase from '@/components/home/BrandShowcase';
import BuyersGuide from '@/components/home/BuyersGuide';

const titles = [
  "Mattress Market Abuja | Premium Mattress Showroom",
  "Mattress Store Abuja | Buy Quality Mattresses Online",
  "Abuja Online Mattress Depot | Best Prices & Sizes",
  "Mattress Showroom Abuja | Vitafoam, Winco & More Brands",
  "Prices of Mattress in Abuja | Vitafoam, Winco & More Brands",
];

export function generateMetadata() {
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: "Shop premium mattresses in Abuja. Vitafoam, Winco, and top brands. All sizes available. Best prices. Fast delivery across Abuja.",
    keywords: "mattress abuja, buy mattress nigeria, vitafoam abuja, mouka mattress, winco foam, premium mattress showroom",
    alternates: {
      canonical: 'https://www.mattressmarket.ng',
    },
    openGraph: {
      title: "Mattress Market Abuja | Premium Mattress Showroom",
      description: "Shop premium mattresses in Abuja. Vitafoam, Winco, and top brands. All sizes available. Best prices. Fast delivery across Abuja.",
      url: 'https://www.mattressmarket.ng',
      siteName: 'MattressMarket Nigeria',
      images: [
        {
          url: 'https://www.mattressmarket.ng/images/main.jpg',
          width: 1200,
          height: 630,
          alt: 'MattressMarket Abuja',
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Mattress Market Abuja | Premium Mattress Showroom",
      description: "Shop premium mattresses in Abuja. Vitafoam, Winco, and top brands. All sizes available.",
      images: ['https://www.mattressmarket.ng/images/main.jpg'],
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

export default function Home() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MattressMarket Nigeria",
    "url": "https://www.mattressmarket.ng",
    "description": "Shop premium mattresses in Abuja. Vitafoam, Winco, and top brands.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.mattressmarket.ng/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <HeroSlider />
      <WhyBuyFromUs />
      <BuyersGuide />
      <BrandShowcase />
      <ShopByCategory />
      <FeaturedProducts />
      <NewArrivals />
    </Layout>
  );
}