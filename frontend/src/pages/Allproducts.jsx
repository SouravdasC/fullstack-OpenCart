import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../redux/thunk/productThunk';
import toast from 'react-hot-toast';
import ProductsCard from '../components/product/ProductsCard';
import { useSearchParams } from 'react-router-dom';
import PaginationCom from '@/components/pagination/PaginationCom';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import MetaData from '@/components/layout/MetaData';
import { Rating } from 'react-simple-star-rating';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'; // Import icons for mobile filter toggle
import { SkeletonAllProducts } from '@/components/shimmerEffect/SkeletonAllProducts.jsx';

const Allproducts = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1); // Initialize to 1 or from searchParams
  const [price, setPrice] = useState([]);
  const [categories, setCategories] = useState('');
  const [ratings, setRatings] = useState(0);

  // UI state
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // For mobile filter sidebar
  const debounceRef = useRef(null);

  // Categories for the filter menu
  const categoriesMenu = [
    'mobile',
    'tv',
    'fridge',
    'ac',
    'footwear',
    'camera',
    'laptop',
    'electronics',
    'clothing',
  ];

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
    minPrice,
    maxPrice,
  } = useSelector(state => state.product);

  // Initialize price range based on min/max price from Redux
  useEffect(() => {
    if (
      typeof minPrice === 'number' &&
      typeof maxPrice === 'number' &&
      (price[0] === undefined || price[0] < minPrice || price[1] > maxPrice)
    ) {
      setPrice([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, price]); // Depend on minPrice, maxPrice

  // Handle price range changes
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  // Get keyword from URL search parameters
  const keyword = searchParams.get('keyword') || '';

  // Debounce product fetching
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      dispatch(
        getProduct({
          keyword,
          page: currentPage,
          price: price,
          category: categories,
          ratings: ratings,
        })
      );
    }, 500); // Debounce for 500ms

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [price, keyword, currentPage, dispatch, categories, ratings]);

  // Handle error toasts
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Product not found or bad request'); // Use error.message if available
    }
  }, [error]);

  // Close mobile filter menu when a filter is applied
  useEffect(() => {
    if (
      isFilterMenuOpen &&
      (categories || ratings > 0 || price[0] !== minPrice || price[1] !== maxPrice)
    ) {
      setIsFilterMenuOpen(false);
    }
  }, [categories, ratings, price, isFilterMenuOpen, minPrice, maxPrice]);

  // Reset all filters
  const resetFilters = () => {
    setCategories('');
    if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
      setPrice([minPrice, maxPrice]);
    } else {
      setPrice([0, 25000]); // Fallback if min/maxPrice not loaded yet
    }
    setRatings(0);
    setCurrentPage(1); // Reset to first page on filter clear
    toast.success('Filters have been reset!');
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <MetaData title="All Products - ECOMMERCE" />

      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden sticky top-16 z-20 bg-white dark:bg-slate-800 shadow-md p-3 flex justify-between items-center transition-all duration-300">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-300 transform"
          aria-label={isFilterMenuOpen ? 'Close filters' : 'Open filters'}
        >
          {isFilterMenuOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar (Conditional visibility for mobile) */}
        <aside
          className={`
                        fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-xl z-30 transform
                        ${isFilterMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                        md:relative md:translate-x-0 md:w-1/4 md:shadow-none md:bg-transparent md:dark:bg-transparent
                        transition-transform duration-300 ease-in-out
                        overflow-y-auto custom-scrollbar pt-20 md:pt-0
                    `}
        >
          {/* Close button for mobile filter */}
          <button
            onClick={() => setIsFilterMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white md:hidden hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Close filter menu"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6 p-4 md:p-0">
            {/* Price Filter */}
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md p-5 transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
                Filter by Price
              </h3>
              <Box sx={{ width: '100%' }}>
                <Slider
                  value={price}
                  onChange={priceHandler}
                  valueLabelDisplay="auto"
                  min={minPrice || 0}
                  max={maxPrice || 25000}
                  disableSwap
                  sx={{
                    color: '#3b82f6', // Tailwind blue-500
                    height: 6,
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      border: '2px solid currentColor',
                      '&:focus, &:hover, &.Mui-active': {
                        boxShadow: 'inherit',
                      },
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.5,
                      backgroundColor: '#bfbfbf',
                    },
                  }}
                />
                <p className="text-sm mt-2 text-slate-600 dark:text-slate-400 font-medium">
                  ₹{price[0]} - ₹{price[1]}
                </p>
              </Box>
            </div>

            {/* Category Filter */}
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md p-5 transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
                Filter by Category
              </h3>
              <button
                onClick={resetFilters}
                className={`text-sm mb-3 px-3 py-1 rounded-full border transition-all duration-200
                                    ${
                                      categories === ''
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-500'
                                    }
                                `}
              >
                Reset Filters
              </button>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                {categoriesMenu.map((category, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setCategories(category)}
                      className={`w-full text-left py-2 px-3 rounded-md transition-all duration-200
                                                capitalize hover:bg-blue-500/10 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400
                                                ${
                                                  categories === category
                                                    ? 'bg-blue-500 text-white font-medium shadow-sm hover:bg-blue-600 dark:hover:bg-blue-600'
                                                    : ''
                                                }
                                            `}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ratings Filter */}
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md p-5 transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
                Filter by Ratings
              </h3>
              <Box sx={{ width: '100%' }}>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => setRatings(newRating)}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={5}
                  sx={{
                    color: '#fcd34d', // Tailwind yellow-300
                    height: 6,
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      border: '2px solid currentColor',
                      '&:focus, &:hover, &.Mui-active': {
                        boxShadow: 'inherit',
                      },
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.5,
                      backgroundColor: '#bfbfbf',
                    },
                  }}
                />
                <div className="text-sm mt-2 text-slate-600 dark:text-slate-400 flex items-center justify-center space-x-2">
                  <span>{ratings} Stars & Up</span>
                  <Rating
                    initialValue={ratings}
                    size={20}
                    SVGstyle={{ display: 'inline' }}
                    fillColor="#fcd34d" // yellow-300
                    readonly // Make it read-only as it's just displaying the selected rating
                  />
                </div>
              </Box>
            </div>
          </div>
        </aside>

        {/* Product Grid and Pagination */}
        <section className="w-full md:w-3/4">
          {loading ? (
            <SkeletonAllProducts /> // Your shimmer effect loader
          ) : (
            <>
              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
                  {products.map(product => (
                    <ProductsCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-white dark:bg-slate-800 rounded-lg shadow-md text-slate-700 dark:text-slate-300">
                  <p className="text-xl font-semibold mb-3">
                    No products found matching your criteria!
                  </p>
                  <p className="text-md">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-10">
                <PaginationCom
                  productsCount={productsCount}
                  resultPerPage={resultPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  filteredProductsCount={filteredProductsCount}
                />
              </div>
            </>
          )}
        </section>
      </div>

      {/* Overlay for mobile filter menu */}
      {isFilterMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsFilterMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default Allproducts;
