import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import WhyBuyFromUs from '@/components/home/WhyBuyFromUs';
import ShopByCategory from '@/components/home/ShopByCategory';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import BrandShowcase from '@/components/home/BrandShowcase';
import BuyersGuide from '@/components/home/BuyersGuide';

export default function Home() {
  return (
    <Layout>
      <HeroSlider />
      <WhyBuyFromUs />
      <BuyersGuide />
      <ShopByCategory />
      <FeaturedProducts />
      <NewArrivals />
      <BrandShowcase />
    </Layout>
  );
}