import React from 'react';

export const SkeletonAllProducts = () => {
  return (
    <div className="animate-pulse px-4 py-10 max-w-7xl mx-auto space-y-10">
      {/* Page Title */}
      <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>

      {/* Filters/Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="h-10 w-full md:w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full md:w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl shadow space-y-4">
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-8 bg-gray-400 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        ))}
      </div>
    </div>
  );
};
