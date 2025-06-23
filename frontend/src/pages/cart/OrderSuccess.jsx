import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
        <CheckCircleIcon className="text-green-500 text-[4rem] mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        <Link
          to="/orders"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
        >
          View Your Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
