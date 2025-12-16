export default function WhyBuyFromUs() {
  const reasons = [
    {
      icon: '🚚',
      title: 'Payment On Delivery',
      description: 'Pay after your product is delivered, Within Abuja Only.',
    },
    {
      icon: '✅',
      title: 'Fast Delivery',
      description: 'Same Day Delivery for Order(s) within Abuja.',
    },
    // {
    //   icon: '💰',
    //   title: 'Best Prices',
    //   description: 'Competitive prices with regular discounts and offers.',
    // },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Safe and secure payment options. Pay online or on delivery.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Online Mattress Store
          </h2>
          <p className="text-gray-600 text-lg font-medium">Why shop with us?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group border border-gray-100"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                {reason.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}