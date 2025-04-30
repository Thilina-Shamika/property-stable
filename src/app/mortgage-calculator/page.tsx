'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MortgageCalculator() {
  const [formData, setFormData] = useState({
    propertyPrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '25',
  });

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMortgage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const principal = Number(formData.propertyPrice) - Number(formData.downPayment);
    const monthlyRate = (Number(formData.interestRate) / 100) / 12;
    const numberOfPayments = Number(formData.loanTerm) * 12;

    const monthly = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(monthly);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-black hover:text-black flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-8">Mortgage Calculator</h1>
          
          <form onSubmit={calculateMortgage} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Property Price (AED)
              </label>
              <input
                type="number"
                name="propertyPrice"
                value={formData.propertyPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Down Payment (AED)
              </label>
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                required
                step="0.01"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Loan Term (Years)
              </label>
              <select
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                required
              >
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Calculate Monthly Payment
            </button>
          </form>

          {monthlyPayment !== null && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-bold mb-2">Your Monthly Payment</h2>
              <p className="text-3xl font-bold text-black">
                AED {monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This is an estimate based on the information you provided.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 