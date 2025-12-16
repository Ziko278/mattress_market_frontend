'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import Link from 'next/link';

export default function HeroSlider() {
  const [sliders, setSliders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await apiService.getSliders();
        setSliders(response.data);
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (sliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliders.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (loading) {
    return (
      <div className="w-full h-72 md:h-96 bg-gradient-to-r from-primary to-blue-900 animate-pulse"></div>
    );
  }

  if (!sliders || sliders.length === 0) {
    return (
      <div className="w-full h-72 md:h-96 bg-gradient-to-r from-primary to-blue-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to MattressMarket</h1>
          <p className="text-xl mb-8">Your trusted source for premium mattresses</p>
          <Link href="/shop" className="hover:opacity-90 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 inline-block" style={{ backgroundColor: 'var(--accent-color)' }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-72 md:h-96 overflow-hidden">
      {/* Slides */}
      {sliders.map((slider, index) => (
        <div
          key={slider.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
            index === currentSlide
              ? 'opacity-100 translate-x-0'
              : index < currentSlide
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slider.image})`,
              filter: 'brightness(0.7)',
            }}
          ></div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 md:px-8">
              <div className="max-w-2xl text-white">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                  {slider.title}
                </h2>
                {slider.subtitle && (
                  <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
                    {slider.subtitle}
                  </p>
                )}
                {slider.button_text && slider.button_link && (
                  <Link
                    href={slider.button_link}
                    className="hover:opacity-90 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 inline-block animate-fade-in-up animation-delay-400 hover:scale-105"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    {slider.button_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              style={index === currentSlide ? { backgroundColor: 'var(--accent-color)' } : {}}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}