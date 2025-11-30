import Layout from '@/components/layout/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 prose max-w-none">
              <h2 className="text-2xl font-bold text-darkGray mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Welcome to MattressMarket. These Terms and Conditions govern your use of our
                website and the purchase of products from our online store. By accessing or using
                our website, you agree to be bound by these terms.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">2. Product Information</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We strive to ensure that all product descriptions, specifications, and prices are
                accurate. However, we do not warrant that product descriptions or other content on
                our website are accurate, complete, reliable, current, or error-free.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">3. Orders and Payment</h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>All orders are subject to acceptance and availability</li>
                <li>We accept online payment and pay-on-delivery options</li>
                <li>Prices are in Nigerian Naira (NGN) and include applicable taxes</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Payment must be completed before product delivery</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">4. Delivery</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We offer delivery services within Nigeria. Delivery times vary by location:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Same-day delivery available within Lagos (order before 2 PM)</li>
                <li>Next-day delivery for orders within Lagos</li>
                <li>2-5 business days for other states</li>
                <li>Delivery charges may apply based on location</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">5. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We want you to be completely satisfied with your purchase. Our return policy
                includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>30-day return policy for unused products in original packaging</li>
                <li>Product must be in resalable condition</li>
                <li>Return shipping costs may apply</li>
                <li>Refunds processed within 7-14 business days</li>
                <li>Defective products replaced free of charge</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">6. Warranty</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                All products come with manufacturer warranty. Warranty terms vary by brand and
                product. Please contact us for specific warranty information on your purchase.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">7. User Accounts</h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>You are responsible for maintaining account confidentiality</li>
                <li>You must provide accurate and current information</li>
                <li>Guest checkout is available without creating an account</li>
                <li>We reserve the right to suspend or terminate accounts</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software,
                is the property of MattressMarket or its content suppliers and is protected by
                intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                MattressMarket shall not be liable for any indirect, incidental, special, or
                consequential damages arising out of or in connection with the use of our website
                or products.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">10. Privacy</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Your use of our website is also governed by our Privacy Policy. Please review our
                Privacy Policy to understand our practices.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. Changes will
                be effective immediately upon posting to the website. Your continued use of the
                website constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>📧 Email: support@mattressmarket.com</li>
                <li>📞 Phone: +234 800 000 0000</li>
                <li>💬 WhatsApp: +234 800 000 0000</li>
              </ul>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-primary">
                <p className="text-gray-700">
                  <strong>Acceptance:</strong> By using MattressMarket, you acknowledge that you
                  have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}