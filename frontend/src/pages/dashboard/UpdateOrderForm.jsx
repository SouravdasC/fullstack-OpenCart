import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import toast from 'react-hot-toast';
import { adminUpdateOrder } from '@/redux/thunk/dashboardThunk/adminOrdersThunk/adminOrderThunk';
import {
  clearAdminOrderState,
  updateOrderInList,
} from '@/redux/reducer/dashboard/adminOrders/adminOrderSlice';

const UpdateOrderForm = ({ order, onSuccess }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(order.orderStatus);

  useEffect(() => {
    setStatus(order.orderStatus);
  }, [order]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!status || status === order.orderStatus) {
      toast.error('Please choose a new status');
      return;
    }

    const res = await dispatch(adminUpdateOrder({ id: order._id, status }));

    if (res.meta.requestStatus === 'fulfilled') {
      const updatedOrder = { ...order, orderStatus: status };

      dispatch(updateOrderInList(updatedOrder));
      dispatch(clearAdminOrderState());

      toast.success('Order status updated');
      onSuccess(); // parent cleanup
    } else {
      toast.error(res?.payload || 'Failed to update order');
    }
  };

  return (
    <div className="mt-10 p-6 border rounded-md shadow-md bg-white max-w-xl text-black">
      <h3 className="text-xl font-semibold mb-4">Update Order Status</h3>

      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-4">
          <label htmlFor="status" className="block mb-1 font-medium">
            Order Status
          </label>
          <select
            id="status"
            className="w-full p-2 border rounded-md"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => dispatch(clearAdminOrderState())}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrderForm;
