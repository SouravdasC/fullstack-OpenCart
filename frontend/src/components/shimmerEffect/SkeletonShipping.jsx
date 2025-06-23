import React from 'react';

export const SkeletonShipping = () => {
  return (
    <div className="animate-pulse p-6 md:p-10 max-w-3xl mx-auto mt-10 space-y-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>

      <div className="space-y-4">
        {[1, 2, 3].map(item => (
          <div key={item} className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>

      <div className="h-12 bg-gray-400 dark:bg-gray-800 rounded w-full mt-6"></div>
    </div>
  );
};
