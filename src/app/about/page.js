import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function AboutPage() {
  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: '👨‍💼',
      description: 'Leading the vision for quality sleep solutions.',
    },
    {
      name: 'Jane Smith',
      role: 'Customer Success',
      image: '👩‍💼',
      description: 'Ensuring every customer has the best experience.',
    },
    {
      name: 'Mike Johnson',
      role: 'Operations Manager',
      image: '👨‍🔧',
      description: 'Managing seamless delivery and logistics.',
    },
    {
      name: 'Sarah Williams',
      role: 'Quality Assurance',
      image: '👩‍🔬',
      description: 'Guaranteeing the highest product standards.',
    },
  ];

  const values = [
    {
      icon: '✨',
      title: 'Quality First',
      description: 'We only partner with trusted brands and ensure authentic products.',
    },
    {
      icon: '🤝',
      title: 'Customer Satisfaction',
      description: 'Your comfort and satisfaction are our top priorities.',
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Same-day and next-day delivery across Nigeria.',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive pricing with regular offers and discounts.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About MattressMarket</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your trusted partner for quality sleep solutions across Nigeria
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Founded with a simple mission: to make quality mattresses accessible to
                    everyone in Nigeria. We understand that a good night's sleep is essential
                    for health, productivity, and overall well-being.
                  </p>
                  <p>
                    MattressMarket was born from the frustration of limited options and
                    inconvenient shopping experiences. We saw people struggling to find
                    quality mattresses without having to visit multiple stores or deal with
                    pushy salespeople.
                  </p>
                  <p>
                    Today, we've partnered with leading mattress brands like Vitafoam, Mouka,
                    and Winco to bring you the best selection online. We've delivered
                    thousands of mattresses across Nigeria, helping families sleep better
                    every night.
                  </p>
                </div>
              </div>

              <div className="bg-lightGray rounded-xl p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-8xl mb-6">🛏️</div>
                  <p className="text-2xl font-bold text-primary">5000+</p>
                  <p className="text-gray-600">Happy Customers</p>
                  <div className="mt-8 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-3xl font-bold text-secondary">500+</p>
                      <p className="text-sm text-gray-600">Products</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-accent">24/7</p>
                      <p className="text-sm text-gray-600">Support</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">15+</p>
                      <p className="text-sm text-gray-600">Brands</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-lightGray">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                Our Values
              </h2>
              <p className="text-gray-600 text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                >
                  <div className="text-6xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-darkGray mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 text-lg">
                Passionate people dedicated to your comfort
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-primary to-blue-900 h-48 flex items-center justify-center text-8xl">
                    {member.image}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-darkGray mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-blue-900 text-white">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
              <p className="text-xl">We're more than just an online store</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-4xl">
                  ✅
                </div>
                <h3 className="text-xl font-bold mb-2">Authenticity Guaranteed</h3>
                <p className="text-white/90">
                  100% genuine products from authorized distributors
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-4xl">
                  🏠
                </div>
                <h3 className="text-xl font-bold mb-2">Home Delivery</h3>
                <p className="text-white/90">
                  We bring your mattress right to your doorstep
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-4xl">
                  💬
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                <p className="text-white/90">
                  Our team helps you choose the perfect mattress
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lightGray">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
              Ready to Experience Better Sleep?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Browse our collection and find your perfect mattress today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-primary hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}