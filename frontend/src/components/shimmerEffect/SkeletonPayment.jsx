import React from 'react';

export const SkeletonPayment = () => {
  return (
    <div className="animate-pulse p-6 md:p-10 max-w-3xl mx-auto mt-12 space-y-8">
      {/* Title Placeholder */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>

      {/* Payment Method Radio Options */}
      <div className="space-y-4">
        {[1, 2].map(item => (
          <div key={item} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        ))}
      </div>

      {/* Card Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Submit Button Placeholder */}
      <div className="h-12 bg-gray-400 dark:bg-gray-800 rounded w-full mt-6"></div>
    </div>
  );
};
