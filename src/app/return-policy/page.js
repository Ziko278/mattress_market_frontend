import Layout from '@/components/layout/Layout';

export default function ReturnPolicyPage() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
            <p className="text-xl">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 prose max-w-none">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At MattressMarket, customer satisfaction is important to us. We carefully inspect
                all products before delivery to ensure they meet quality standards. Please read our
                return policy carefully before placing an order.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Eligibility for Returns</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Due to the hygienic and personal nature of mattresses and bedding products:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Mattresses are <strong>NOT eligible for return</strong> once unsealed, used, or slept on</li>
                <li>Returns are only accepted if the mattress is unused, unopened, and in its original packaging</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Return Timeframe</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                All return requests must be made within <strong>24–48 hours of delivery</strong>.
                Any request made after this period may not be accepted.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Items Eligible for Return</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You may request a return or replacement if:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>You received a wrong size or wrong product</li>
                <li>The mattress has a manufacturing defect</li>
                <li>The product was damaged during delivery</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Items NOT Eligible for Return</h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Mattresses that have been unwrapped, used, or exposed to moisture</li>
                <li>Products with stains, odors, or physical damage after delivery</li>
                <li>Change-of-mind returns after unsealing</li>
                <li>Clearance or promotional items (unless defective)</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Inspection on Delivery</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Customers are strongly advised to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Inspect the mattress immediately upon delivery</li>
                <li>Confirm size, brand, and condition before accepting the item</li>
              </ul>
              <p className="text-gray-700 mb-6 leading-relaxed">
                <strong>Once accepted, MattressMarket will not be liable for issues arising from use.</strong>
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Return Process</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To initiate a return:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Contact our customer support within the return window</li>
                <li>Provide your order number, clear photos, and reason for return</li>
                <li>Our team will review and respond within 24–72 hours</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Refunds & Replacements</h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Approved returns may be eligible for replacement or refund, depending on the case</li>
                <li>Refunds (if approved) will be processed to the customer's bank account within <strong>7–14 business days</strong></li>
                <li>Delivery fees are non-refundable, except in cases of company error</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Return Delivery Cost</h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Customers are responsible for return delivery costs, except where the issue resulted from our error</li>
                <li>Pick-up may be arranged within Abuja at an additional cost</li>
              </ul>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Warranty Claims</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Some mattresses come with a manufacturer's warranty. Warranty claims are handled
                according to the brand's warranty terms and conditions.
              </p>

              <h2 className="text-2xl font-bold text-darkGray mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For all return and refund inquiries:
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>📧 Email: abujamattressmarket@gmail.com</li>
                <li>📞 Phone/WhatsApp: 0811 221 9722</li>
              </ul>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-primary">
                <p className="text-gray-700">
                  <strong>Important Notice:</strong> Please inspect your mattress carefully upon
                  delivery and contact us immediately if there are any concerns. We are committed
                  to ensuring you receive a quality product that meets your expectations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}