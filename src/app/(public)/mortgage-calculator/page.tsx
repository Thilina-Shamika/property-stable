'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ConsultingForm from '@/components/mortgage/ConsultingForm';
import { Toaster } from 'react-hot-toast';

export default function MortgageCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [downPayment, setDownPayment] = useState(100000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(50);
  const [loanPeriod, setLoanPeriod] = useState(1);
  const [interestRate, setInterestRate] = useState(1);
  const [monthlyRepayment, setMonthlyRepayment] = useState(0);
  const [showConsultingForm, setShowConsultingForm] = useState(false);

  useEffect(() => {
    calculateMonthlyRepayment();
  }, [purchasePrice, downPayment, loanPeriod, interestRate]);

  const calculateMonthlyRepayment = () => {
    const loanAmount = purchasePrice - downPayment;
    const yearlyInterestRate = interestRate / 100;
    const numberOfPayments = loanPeriod * 12;

    if (loanAmount <= 0 || yearlyInterestRate <= 0 || numberOfPayments <= 0) {
      setMonthlyRepayment(0);
      return;
    }

    // Calculate monthly payment using the formula:
    // Monthly Payment = (Loan Amount * (1 + Yearly Interest Rate)) / Number of Months
    // Plus an additional 5% for fees and charges
    const monthlyPayment = (loanAmount * (1 + yearlyInterestRate)) / numberOfPayments;
    const monthlyPaymentWithFees = monthlyPayment * 1.05;
    setMonthlyRepayment(Math.round(monthlyPaymentWithFees));
  };

  const handlePurchasePriceChange = (value: number) => {
    setPurchasePrice(value);
    const newDownPayment = (value * downPaymentPercentage) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    const percentage = (value / purchasePrice) * 100;
    setDownPaymentPercentage(Math.min(Math.round(percentage * 10) / 10, 100));
  };

  const handleDownPaymentPercentageChange = (value: number) => {
    setDownPaymentPercentage(value);
    const newDownPayment = (purchasePrice * value) / 100;
    setDownPayment(Math.round(newDownPayment));
  };

  return (
    <main className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <Header />
      <div className="max-w-2xl border border-gray-200 shadow-md rounded-lg mt-30 mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#002D4B] mb-4">
          Calculate your mortgage repayments
        </h1>

        <div className="space-y-4">
          {/* Purchase Price */}
          <div>
            <label className="block text-[#002D4B] font-medium mb-1 text-sm">
              Purchase Price
            </label>
            <input
              type="range"
              min={200000}
              max={3500000}
              value={purchasePrice}
              onChange={(e) => handlePurchasePriceChange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-0.5 text-xs text-gray-600">
              <span>AED {(200000).toLocaleString()}</span>
              <span>AED {(3500000).toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => handlePurchasePriceChange(Number(e.target.value))}
              className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-[#002D4B] font-medium mb-1 text-sm">
              Down Payment
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={purchasePrice}
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-0.5 text-xs text-gray-600">
                  <span>AED {(0).toLocaleString()}</span>
                  <span>AED {purchasePrice.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div className="w-20">
                <input
                  type="number"
                  value={downPaymentPercentage}
                  onChange={(e) => handleDownPaymentPercentageChange(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-gray-600 mt-0.5 block text-right">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Loan Period */}
          <div>
            <label className="block text-[#002D4B] font-medium mb-1 text-sm">
              Loan Period
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-0.5 text-xs text-gray-600">
              <span>1 year</span>
              <span>30 years</span>
            </div>
            <input
              type="number"
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(Number(e.target.value))}
              className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-[#002D4B] font-medium mb-1 text-sm">
              Interest Rate:
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-0.5 text-xs text-gray-600">
              <span>1%</span>
              <span>20%</span>
            </div>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Monthly Repayment */}
          <div className="mt-4">
            <p className="text-xs text-gray-600">Monthly repayment</p>
            <p className="text-xl font-bold text-[#002D4B]">
              AED {monthlyRepayment.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              * Estimated initial monthly payments based on a AED {purchasePrice.toLocaleString()} purchase price with a {interestRate}% fixed interest rate.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <h2 className="text-lg font-bold text-[#002D4B] mb-3">
              Need help or ready to proceed?
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowConsultingForm(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Start Mortgage Approval
              </button>
              <button className="border-2 text-black px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors text-sm">
                Speak to our team
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConsultingForm && (
        <ConsultingForm
          calculatorValues={{
            purchasePrice,
            downPayment,
            loanPeriod,
            interestRate,
            monthlyRepayment,
          }}
          onClose={() => setShowConsultingForm(false)}
        />
      )}
    </main>
  );
} 