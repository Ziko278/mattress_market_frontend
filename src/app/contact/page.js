'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';

export default function ContactPage() {
  const [siteInfo, setSiteInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await apiService.getSiteInfo();
        setSiteInfo(response.data);
      } catch (error) {
        console.error('Error fetching site info:', error);
      }
    };
    fetchSiteInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call (you can implement backend endpoint later)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20">
          <div className="container mx-auto px-6 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              We'd love to hear from you. Get in touch with us today!
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <section className="py-16 bg-lightGray">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-primary/10 rounded-full p-3 text-3xl">📞</div>
                    <h3 className="text-xl font-bold text-darkGray">Call Us</h3>
                  </div>
                  <p className="text-gray-600 mb-2">Mon - Sat: 8am - 8pm</p>
                  {siteInfo && (
                    <>
                      <a
                        href={`tel:${siteInfo.phone}`}
                        className="block text-primary hover:underline font-semibold"
                      >
                        {siteInfo.phone}
                      </a>
                      {siteInfo.alternate_phone && (
                        <a
                          href={`tel:${siteInfo.alternate_phone}`}
                          className="block text-primary hover:underline font-semibold"
                        >
                          {siteInfo.alternate_phone}
                        </a>
                      )}
                    </>
                  )}
                </div>

                {/* Email */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-secondary/10 rounded-full p-3 text-3xl">✉️</div>
                    <h3 className="text-xl font-bold text-darkGray">Email Us</h3>
                  </div>
                  <p className="text-gray-600 mb-2">24/7 Email Support</p>
                  {siteInfo && (
                    <a
                      href={`mailto:${siteInfo.email}`}
                      className="block text-primary hover:underline font-semibold break-all"
                    >
                      {siteInfo.email}
                    </a>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-green-100 rounded-full p-3 text-3xl">💬</div>
                    <h3 className="text-xl font-bold text-darkGray">WhatsApp</h3>
                  </div>
                  <p className="text-gray-600 mb-2">Quick Response</p>
                  {siteInfo?.whatsapp && (
                    <a
                      href={`https://wa.me/${siteInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                    >
                      Chat on WhatsApp
                    </a>
                  )}
                </div>

                {/* Address */}
                {/* <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-accent/10 rounded-full p-3 text-3xl">📍</div>
                    <h3 className="text-xl font-bold text-darkGray">Visit Us</h3>
                  </div>
                  <p className="text-gray-600 mb-2">Our Location</p>
                  {siteInfo && (
                    <p className="text-gray-700 leading-relaxed">{siteInfo.address}</p>
                  )}
                </div> */}

                {/* Social Media */}
                {siteInfo && (siteInfo.facebook || siteInfo.instagram) && (
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 rounded-full p-3 text-3xl">🌐</div>
                      <h3 className="text-xl font-bold text-darkGray">Follow Us</h3>
                    </div>
                    <div className="flex gap-3">
                      {siteInfo.facebook && (
                        <a
                          href={siteInfo.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-2xl transition-all duration-300 hover:scale-110"
                        >
                          📘
                        </a>
                      )}
                      {siteInfo.instagram && (
                        <a
                          href={siteInfo.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-lg text-2xl transition-all duration-300 hover:scale-110"
                        >
                          📷
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-bold text-darkGray mb-6">Send Us a Message</h2>

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                            errors.name
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-primary'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                            errors.email
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-primary'
                          }`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                            errors.phone
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-primary'
                          }`}
                          placeholder="+234 800 000 0000"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                            errors.subject
                              ? 'border-red-500'
                              : 'border-gray-300 focus:border-primary'
                          }`}
                          placeholder="How can we help?"
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="6"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-300 ${
                          errors.message
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:bg-blue-900 hover:scale-105'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Sending...
                        </span>
                      ) : (
                        '📧 Send Message'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-darkGray mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg">Quick answers to common questions</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Do you offer delivery?',
                  a: 'Yes! We offer same-day delivery within Lagos and next-day delivery nationwide.',
                },
                {
                  q: 'Can I pay on delivery?',
                  a: 'Absolutely! We support both online payment and pay-on-delivery options.',
                },
                {
                  q: 'Are your products authentic?',
                  a: '100% yes. We only work with authorized distributors and guarantee authenticity.',
                },
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day return policy on all products. Contact us for more details.',
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
                >
                  <summary className="font-bold text-lg text-darkGray cursor-pointer">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}