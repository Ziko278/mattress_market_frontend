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
  "Mattress Showroom Abuja | Vitafoam, Winco & More Brands"
];

export function generateMetadata() {
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: "Shop premium mattresses in Abuja. Vitafoam, Winco, and top brands. All sizes available. Best prices. Fast delivery across Abuja."
  };
}

export default function Home() {
  return (
    <Layout>
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