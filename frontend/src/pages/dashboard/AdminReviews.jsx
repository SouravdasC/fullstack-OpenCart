import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  deleteReview,
  getAllReviews,
} from '@/redux/thunk/dashboardThunk/adminReviewsThunk/adminReviewThunk';
import { clearDeletedReviewId } from '@/redux/reducer/dashboard/adminReview/adminReviewSlice';
import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';

const AdminReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productId, setProductId] = useState('');

  const { reviews, loading, error, deletedReviewId, productName } = useSelector(
    state => state.adminReviews
  );

  const handleFetch = () => {
    if (!productId.trim()) {
      toast.error('Enter a valid product ID');
      return;
    }
    dispatch(getAllReviews(productId));
  };

  const handleDelete = reviewId => {
    dispatch(deleteReview({ productId, reviewId }));
  };

  useEffect(() => {
    if (deletedReviewId) {
      toast.success('Review deleted');
      dispatch(getAllReviews(productId));
      dispatch(clearDeletedReviewId());
    }
  }, [deletedReviewId, dispatch, productId]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DashboardSideBar />

      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Product Reviews
        </h1>

        {/* Product Info */}
        {productName && (
          <div className="mb-4 text-gray-700 dark:text-gray-300">
            <p className="text-base sm:text-lg font-medium">
              Reviews for Product:{' '}
              <span
                onClick={() => navigate(`/product/${productId}`)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {productName}
              </span>{' '}
              <span className="text-sm text-gray-500 dark:text-gray-400">(ID: {productId})</span>
            </p>
          </div>
        )}

        {/* Input & Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Product ID"
            className="border p-2 rounded w-full sm:w-[400px] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={productId}
            onChange={e => setProductId(e.target.value)}
          />
          <button
            onClick={handleFetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Fetch Reviews
          </button>
        </div>

        {/* Review Table */}
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No reviews found.</p>
        ) : (
          <div className="overflow-x-auto rounded shadow">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-2 border">User</th>
                  <th className="p-2 border">Rating</th>
                  <th className="p-2 border">Comment</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center text-gray-800 dark:text-gray-100">
                {reviews.map(review => (
                  <tr key={review._id} className="border-t border-gray-300 dark:border-gray-700">
                    <td className="p-2 border">
                      <button
                        onClick={() => navigate(`/admin/user/${review.user}`)}
                        className="text-blue-600 hover:underline"
                      >
                        {review.name}
                      </button>
                    </td>
                    <td className="p-2 border">{review.rating}</td>
                    <td className="p-2 border">{review.comment}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => navigate(`/product/${productId}`)}
                        className="text-green-600 hover:underline"
                      >
                        View Product
                      </button>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {productId}
                      </div>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:underline flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviews;
