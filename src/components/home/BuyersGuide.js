'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';

export default function BuyersGuide() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [weights, setWeights] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const carouselImages = [
    'https://vitafoamabuja.com.ng/media/images/product/vitagrand2x-510x510.jpg',
    'https://wincofoam.com/wp-content/uploads/2025/07/winco-porsche-123.jpg',
    'https://res.cloudinary.com/ddzaz5fjq/image/upload/c_fit,e_sharpen:200,h_880,q_auto:best,w_880/v1/mouka-cloud-mattress/stagingproduct/325/rp5awkz3q7jrf5uz40w9.webp',
  ];

  useEffect(() => {
    setIsClient(true);
    
    // Fetch weights data
    const fetchWeights = async () => {
      try {
        const weightsResponse = await apiService.getWeights();
        setWeights(weightsResponse.data);
      } catch (error) {
        console.error('Error fetching weights:', error);
      }
    };
    fetchWeights();

    // Image carousel rotation
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleWeightClick = (weight) => {
    // Navigate to shop page with weight parameter
    window.location.href = `/shop?weight=${encodeURIComponent(weight)}`;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left Content */}
            <div className="flex flex-col justify-center text-white">
              <div className="flex items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">Buyer's Guide</h2>
              </div>

              <p className="text-lg md:text-xl mb-6 text-white text-opacity-95">
                So many mattresses to choose from!
                <br />
                Let's help you choose the best one for you.
              </p>

              <p className="text-base mb-8 text-white text-opacity-90">
                Our Buyer's Guide helps you find the perfect mattress based on your weight,
                ensuring optimal comfort and support for years to come.
              </p>
            </div>

            {/* Right Content - Image Carousel */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden shadow-2xl">
                {isClient && carouselImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Mattress ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                {/* Carousel Indicators */}
                {isClient && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weight Selection Section */}
        <div className="mt-8 bg-purple-50 rounded-2xl p-8 border border-purple-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Select Your Weight Range</h3>
          <div className="max-w-md mx-auto">
            <select
              onChange={(e) => handleWeightClick(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white text-gray-800 cursor-pointer hover:border-purple-300"
              defaultValue=""
            >
              <option value="" disabled>Choose your weight range...</option>
              {weights.map((weight, index) => (
                <option key={index} value={weight.weight}>
                  {weight.weight} {weight.description ? `- ${weight.description}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-purple-50 rounded-2xl p-8 border border-purple-100">
          <div className="flex items-start">
            <div className="bg-purple-600 rounded-full p-3 mr-4 mt-1">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Why Weight Matters</h4>
              <p className="text-gray-700">
                Choosing the right mattress based on your weight ensures proper support,
                prevents premature wear, and eliminates body and joint pains. Our curated
                selection guarantees you'll find the perfect fit for your needs.
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}