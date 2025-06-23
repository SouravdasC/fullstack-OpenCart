import React, { useEffect, useMemo, useState } from 'react';
import { LuMouse } from 'react-icons/lu';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../redux/thunk/productThunk';
import toast from 'react-hot-toast';
import ProductsCard from '../components/product/ProductsCard';
import { Link } from 'react-router-dom';
import MetaData from '../components/layout/MetaData';
import { SkeletonHome } from '@/components/shimmerEffect/SkeletonHome';

const categories = ['All', 'Home', 'Mobile', 'Camera', 'Tv', 'Ac'];

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.product);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error('Product not found');
  }, [error]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category?.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [products, activeCategory]);

  const productCards = useMemo(
    () =>
      filteredProducts?.map(product => (
        <ProductsCard key={product._id || product.id} product={product} />
      )),
    [filteredProducts]
  );

  return (
    <>
      <MetaData title="Home - Ecommerce" />
      {loading ? (
        <SkeletonHome />
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-50 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-all">
          {/* Hero Section */}
          <section
            className="relative flex flex-col justify-center items-center text-white h-[70vh] md:h-screen overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }}
            aria-label="Welcome Banner"
          >
            <div className="absolute inset-0 bg-black/30 z-0" />
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="z-10 text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-center drop-shadow-lg"
            >
              Welcome to Ecommerce
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="z-10 mt-4 text-lg md:text-2xl font-medium text-center"
            >
              Find amazing products below
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="z-10 mt-8 flex items-center gap-2 px-6 py-3 bg-white/90 text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all"
              onClick={() =>
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }
              aria-label="Scroll to products"
            >
              Scroll <LuMouse className="ml-2" />
            </motion.button>
          </section>

          {/* Products Section */}
          <section id="products" className="container mx-auto px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 capitalize text-indigo-800 dark:text-white">
              Featured Products
            </h2>

            {/* Category Tabs */}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full border transition-all duration-300 text-sm font-semibold ${
                    activeCategory === cat
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div
              data-aos="fade-up"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {productCards?.length > 0 ? (
                productCards
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 italic">
                  No products found in this category.
                </div>
              )}
            </div>

            {/* View All Button */}
            <div className="flex justify-center items-center mt-10">
              <Link
                to="/products"
                className="rounded-full bg-red-500 text-white font-bold uppercase px-6 py-2 shadow hover:bg-red-400 hover:text-black transition-all"
              >
                All Products
              </Link>
            </div>
          </section>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition-all z-50 cursor-pointer"
            aria-label="Back to top"
          >
            <AiOutlineArrowUp size={24} />
          </button>
        </main>
      )}
    </>
  );
};

export default Home;
