import React from 'react';

export const SkeletonHome = () => {
  return (
    <div className="animate-pulse px-4 py-10 max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>

      {/* Section Title */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto"></div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-xl shadow p-4 space-y-4">
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-8 bg-gray-400 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
