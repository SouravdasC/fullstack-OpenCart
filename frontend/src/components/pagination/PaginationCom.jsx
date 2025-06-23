import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination';

const PaginationCom = ({ resultPerPage, productsCount, currentPage, setCurrentPage }) => {
  const totalPages = resultPerPage && productsCount ? Math.ceil(productsCount / resultPerPage) : 0;

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div>
      <div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevious}
                    className={`${
                      currentPage === 1
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  />
                </PaginationItem>

                {/* Numbered Buttons */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 cursor-pointer rounded border ${
                        currentPage === index + 1 ? 'bg-gray-500 text-black' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    className={`${
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginationCom;
