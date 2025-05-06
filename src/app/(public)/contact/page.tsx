'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';

const faqs = [
  {
    question: 'How can I schedule a property viewing?',
    answer: 'You can schedule a property viewing by contacting us through our contact form, calling our office, or emailing us directly. Our team will get back to you within 24 hours to arrange a convenient time.'
  },
  {
    question: 'What areas do you cover?',
    answer: 'We cover all major areas in the UAE, including Dubai, Abu Dhabi, and Sharjah. Our team has extensive knowledge of the local real estate market in these regions.'
  },
  {
    question: 'Do you offer property management services?',
    answer: 'Yes, we offer comprehensive property management services including tenant screening, rent collection, maintenance coordination, and regular property inspections.'
  },
  {
    question: 'What are your office hours?',
    answer: 'Our office is open from Sunday to Thursday, 9:00 AM to 6:00 PM. We are closed on Fridays and Saturdays.'
  },
  {
    question: 'How do I list my property with you?',
    answer: 'You can list your property by filling out our contact form or calling our office. Our team will guide you through the process and help you get the best value for your property.'
  }
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    purpose: 'Buy',
    message: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'United Arab Emirates',
    format: '50 123 4567'
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handlePhoneChange = (value: string, country: any) => {
    setFormData({...formData, phone: value});
    setSelectedCountry({
      name: country.name,
      format: '50 123 4567'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Thank you for your inquiry! Our team will contact you shortly.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#1b2734',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        purpose: 'Buy',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#1b2734] py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Contact Us</h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            Get in touch with our team for any inquiries about properties, services, or to schedule a viewing.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#1b2734] mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#1b2734] mb-2">Office Address</h3>
                <p className="text-gray-600">123 Business Bay, Dubai, UAE</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1b2734] mb-2">Phone</h3>
                <p className="text-gray-600">+971 4 123 4567</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1b2734] mb-2">Email</h3>
                <p className="text-gray-600">info@edproperty.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-[#1b2734] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1b2734] focus:border-[#1b2734]"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="phone-input-container">
                  <PhoneInput
                    country={'ae'}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      placeholder: '50 123 4567',
                      required: true,
                    }}
                    containerClass="phone-input"
                    inputClass="!w-full !h-[50px] !pl-[130px] !bg-white !rounded !text-gray-900 !placeholder-gray-400 !border-gray-300 focus:!outline-none focus:!ring-2 focus:!ring-[#1b2734] focus:!border-[#1b2734] !text-[15px]"
                    buttonClass="!bg-white !border-gray-300 !rounded-l !w-[120px] !h-full"
                    dropdownClass="!bg-white !text-gray-900"
                    enableSearch={false}
                    preferredCountries={['ae']}
                  />
                </div>
                <div className="text-gray-500 text-xs mt-1 pl-1">
                  Selected: {selectedCountry.name} • Format: {selectedCountry.format}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1b2734] focus:border-[#1b2734]"
                  placeholder="Your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <select
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1b2734] focus:border-[#1b2734]"
                  required
                >
                  <option value="Buy">Buy</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Off Plan">Off Plan</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1b2734] focus:border-[#1b2734]"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#393e46] text-white py-3 px-6 rounded-md hover:bg-[#4a4f5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-[#1b2734] text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-semibold text-[#1b2734]">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-[#1b2734]" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-[#1b2734]" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .phone-input-container {
          width: 100%;
        }
        .phone-input {
          width: 100%;
        }
        .phone-input .flag-dropdown {
          width: 120px !important;
          height: 100% !important;
          background-color: white !important;
          border: 1px solid #d1d5db !important;
          border-right: none !important;
        }
        .phone-input .selected-flag {
          width: 120px !important;
          padding: 0 0 0 15px !important;
          background-color: transparent !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .phone-input .selected-flag .flag {
          transform: scale(1.5);
        }
        .phone-input .selected-flag:after {
          content: "" !important;
          display: inline-block !important;
          width: 0 !important;
          height: 0 !important;
          margin-left: 4px !important;
          border-left: 5px solid transparent !important;
          border-right: 5px solid transparent !important;
          border-top: 5px solid #374151 !important;
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
        .phone-input .selected-flag .arrow {
          display: none !important;
        }
        .phone-input .form-control {
          height: 50px !important;
          padding-left: 130px !important;
          font-size: 15px !important;
        }
        .phone-input .country-code {
          color: #374151 !important;
          font-size: 15px !important;
          margin-left: 8px !important;
        }
        .phone-input .selected-flag:hover,
        .phone-input .selected-flag:focus,
        .phone-input .selected-flag.open {
          background-color: white !important;
        }
        .phone-input .country-list {
          background-color: white !important;
          color: #374151 !important;
          margin-top: 2px !important;
          width: 350px !important;
          max-height: 300px !important;
          border: 1px solid #d1d5db !important;
        }
      `}</style>
    </div>
  );
} 