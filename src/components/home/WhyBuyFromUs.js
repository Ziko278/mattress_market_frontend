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
      description: 'Same Day Delivery for Order(s) witin Abuja.',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive prices with regular discounts and offers.',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Safe and secure payment options. Pay online or on delivery.',
    },
  ];

  return (
    <section className="py-16 bg-lightGray">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
            Online Mattress Store
          </h2>
          <p className="text-gray-600 text-lg">Why shop with us?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-darkGray mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}