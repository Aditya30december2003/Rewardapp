"use client"
import { formatDateToLocal } from '@/lib/utils';
import React from 'react';
import { toast } from 'react-toastify';

const Coupon = ({
  points,
  discountText,
  couponCode,
  buttonLabel,
  expiryDate,
  bgGradient = 'from-purple-600 to-indigo-600',
  textColor = 'text-white',
}) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success('Coupon code copied!');
  };

  return (
    <div className="container mx-auto">
      <div
        className={`bg-gradient-to-br ${bgGradient} ${textColor} text-center py-10 px-20 rounded-lg shadow-md relative`}
      >

        <h3 className="text-2xl font-semibold mb-4">{discountText}</h3>
        <h3 className="text-2xl font-semibold mb-4">Points Required: {points}</h3>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="border-dashed border px-4 py-2 rounded-l">{couponCode}</span>
          <button
            onClick={handleCopyCode}
            className="border border-white bg-white text-purple-600 px-4 py-2 rounded-r cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
        <p className="text-sm">Valid Till: {formatDateToLocal(expiryDate)}</p>

        <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
        <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
      </div>
    </div>
  );
};

export default Coupon;
