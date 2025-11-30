import Layout from '@/components/layout/Layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 prose max-w-none">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At MattressMarket, we are committed to protecting your privacy and ensuring the
                security of your personal information. This Privacy Policy explains how we collect,
                use, and safeguard your data.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-darkGray mb-3">Personal Information:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Delivery address</li>
                <li>Payment information (processed securely)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-darkGray mb-3">Automatically Collected:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent on site</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate order updates and delivery information</li>
                <li>Provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Delivery Partners:</strong> To fulfill your orders</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Service Providers:</strong> Who help us operate our business</li>
                <li><strong>Legal Requirements:</strong> When required by law</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We implement industry-standard security measures to protect your personal
                information, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure payment gateways</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Data backup and recovery systems</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">5. Cookies</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We use cookies to enhance your browsing experience, remember your preferences, and
                analyze website traffic. You can control cookie settings through your browser, but
                disabling cookies may limit some website functionality.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">7. Marketing Communications</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                With your consent, we may send you promotional emails about new products, special
                offers, and updates. You can unsubscribe at any time by clicking the unsubscribe
                link in our emails or contacting us directly.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">8. Third-Party Links</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for
                the privacy practices of these external sites. We encourage you to read their
                privacy policies.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our website is not intended for children under 18. We do not knowingly collect
                personal information from children. If we become aware of such collection, we will
                delete the information immediately.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">10. Data Retention</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes
                outlined in this policy, unless a longer retention period is required by law.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">11. Changes to Privacy Policy</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any
                significant changes by posting the new policy on our website and updating the "Last
                Updated" date.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your rights,
                please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>📧 Email: privacy@mattressmarket.com</li>
                <li>📞 Phone: +234 800 000 0000</li>
                <li>💬 WhatsApp: +234 800 000 0000</li>
                <li>📍 Address: [Your Business Address]</li>
              </ul>

              <div className="mt-12 p-6 bg-green-50 rounded-lg border-l-4 border-accent">
                <p className="text-gray-700">
                  <strong>Your Trust Matters:</strong> We are committed to maintaining the highest
                  standards of privacy and security. Your trust is important to us, and we work
                  continuously to protect your personal information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}