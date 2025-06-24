import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  adminDeleteProduct,
  fetchAdminProducts,
} from '@/redux/thunk/dashboardThunk/adminProductThunks/adminProductThunks';
import {
  setUpdateProduct,
  clearAdminProductState,
  removeProductFromList,
} from '@/redux/reducer/dashboard/adminProducts/adminProductsListSlice';

import CreateProduct from './CreateProduct';
import PaginationCom from '@/components/pagination/PaginationCom';
import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';
import MetaData from '@/components/layout/MetaData';

const ProductsList = () => {
  const dispatch = useDispatch();
  const { products, loading, updateProduct, error, success } = useSelector(
    state => state.adminProduct
  );

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    dispatch(fetchAdminProducts({ keyword, page: currentPage }));
  }, [dispatch, currentPage, keyword]);

  useEffect(() => {
    if (error) toast.error('Product list not found');
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success('Product updated successfully');
      dispatch(clearAdminProductState());
    }
  }, [success, dispatch]);

  const handleEdit = product => {
    dispatch(setUpdateProduct(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const res = await dispatch(adminDeleteProduct(id));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(removeProductFromList(id));
        toast.success('Product deleted successfully');
      }
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products?.products || [];

    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter !== 'All') {
      list = list.filter(p => p.category === categoryFilter);
    }
    if (sortOrder === 'asc') list.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'desc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, categoryFilter, sortOrder]);

  const categoryOptions = useMemo(() => {
    const categories = new Set(products?.products?.map(p => p.category));
    return ['All', ...Array.from(categories)];
  }, [products]);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <MetaData title="Product List" />

      <DashboardSideBar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Admin Product Management
        </h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded-md w-full sm:w-auto"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Ratings</th>
                <th className="p-3 text-left">Reviews</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr
                    key={product._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3 text-gray-800 dark:text-white">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{product._id}</td>
                    <td className="p-3 text-green-600 font-semibold">₹{product.price}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.ratings}</td>
                    <td className="p-3">{product.numOfReviews}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500 dark:text-gray-400">
                    {loading ? 'Loading products...' : 'No products match the filter'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 border rounded shadow bg-white dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">Total Products</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            {products?.productsCount}
          </p>
        </div>

        {updateProduct && (
          <div className="mt-10">
            <CreateProduct
              productToEdit={updateProduct}
              onSuccess={() => dispatch(clearAdminProductState())}
            />
          </div>
        )}

        <div className="mt-10">
          <PaginationCom
            productsCount={products?.productsCount}
            resultPerPage={products?.resultPerPage}
            currentPage={products?.currentPage}
            setCurrentPage={setCurrentPage}
            filteredProductsCount={products?.filteredProductsCount}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductsList;
