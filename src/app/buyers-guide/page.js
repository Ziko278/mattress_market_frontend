// app/buyers-guide/page.js
import Layout from '@/components/layout/Layout';
import BuyersGuide from '@/components/home/BuyersGuide';

export const metadata = {
  title: 'Buyer\'s Guide - Find Your Perfect Mattress | MattressMarket',
  description: 'Find the perfect mattress based on your weight. Our comprehensive buyer\'s guide helps you choose the right mattress for optimal comfort and support.',
  keywords: 'mattress buying guide, choose mattress by weight, mattress selection, best mattress for your weight',
  openGraph: {
    title: 'Mattress Buyer\'s Guide - MattressMarket',
    description: 'Find your perfect mattress based on your weight. Expert guidance for optimal comfort and support.',
    type: 'website',
  },
};

export default function BuyersGuidePage() {
  return (
    <Layout>
      <BuyersGuide />
    </Layout>
  );
}