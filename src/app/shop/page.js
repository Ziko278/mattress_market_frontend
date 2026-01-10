import Layout from '@/components/layout/Layout';
import ShopContent from '@/components/shop/ShopContent';

export const metadata = {
  title: 'Shop Premium Mattresses Online | MattressMarket Nigeria',
  description: 'Browse our complete collection of premium mattresses from top brands including Mouka, Vitafoam, and more. Quality mattresses with fast delivery in Abuja and across Nigeria.',
  keywords: 'buy mattress online nigeria, mattress shop abuja, mouka mattress, vitafoam mattress, premium mattresses nigeria',
  openGraph: {
    title: 'Shop Premium Mattresses Online | MattressMarket Nigeria',
    description: 'Browse our complete collection of premium mattresses from top brands. Quality mattresses with fast delivery across Nigeria.',
    url: 'https://www.mattressmarket.ng/shop',
    siteName: 'MattressMarket Nigeria',
    images: [
      {
        url: 'https://www.mattressmarket.ng/images/shop-og.jpg',
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
    title: 'Shop Premium Mattresses Online | MattressMarket Nigeria',
    description: 'Browse our complete collection of premium mattresses from top brands.',
    images: ['https://www.mattressmarket.ng/images/shop-og.jpg'],
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

export default function ShopPage() {
  return (
    <Layout>
      <ShopContent />
    </Layout>
  );
}