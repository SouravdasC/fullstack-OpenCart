import React from 'react';

export const SkeletonProductDetails = () => {
  return (
    <div className="animate-pulse px-4 py-10 max-w-6xl mx-auto space-y-12">
      {/* Top section: Image + Details */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image preview */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-xl w-full"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>

          {/* Variant Buttons */}
          <div className="flex gap-4 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-6">
            <div className="h-10 w-32 bg-gray-400 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-32 bg-gray-400 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        {[1, 2].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
