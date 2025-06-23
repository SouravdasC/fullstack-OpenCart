import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';

import {
  adminUpdateOrder,
  fetchSingleOrder,
} from '@/redux/thunk/dashboardThunk/adminOrdersThunk/adminOrderThunk';

import MetaData from '@/components/layout/MetaData';
import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const printRef = useRef();

  const { singleOrder, loading } = useSelector(state => state.adminOrder);

  useEffect(() => {
    dispatch(fetchSingleOrder(id));
  }, [dispatch, id]);

  const handleDownloadInvoice = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${id}`,
  });

  const updateOrderStatus = async newStatus => {
    const res = await dispatch(adminUpdateOrder({ id, status: newStatus }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(`Order marked as ${newStatus}`);
      dispatch(fetchSingleOrder(id));
    } else {
      toast.error(res.payload || 'Failed to update status');
    }
  };

  if (loading || !singleOrder) {
    return <p className="p-10">Loading order...</p>;
  }

  const isDelivered = singleOrder.orderStatus === 'Delivered';
  const isCancelled = singleOrder.orderStatus === 'Cancelled';

  const totalQuantity = singleOrder.orderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex w-full">
      <MetaData title="Order Details" />
      <DashboardSideBar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order #{singleOrder._id}</h2>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Invoice
            </button>
            {!isDelivered && !isCancelled && (
              <>
                <button
                  onClick={() => updateOrderStatus('Delivered')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => updateOrderStatus('Cancelled')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel Order
                </button>
              </>
            )}
          </div>
        </div>

        {/* Printable Invoice Content */}
        <div ref={printRef} className="bg-white p-6 border rounded shadow-md">
          <p className="mb-2">
            <strong>Date:</strong> {new Date(singleOrder.createdAt).toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {singleOrder.orderStatus}
          </p>
          <p className="mb-2">
            <strong>User:</strong> {singleOrder.user?.name || 'N/A'}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {singleOrder.user?.email || 'N/A'}
          </p>

          <h3 className="text-lg font-semibold mb-2">Shipping Info</h3>
          <p className="mb-4 text-gray-700">
            {singleOrder.shippingInfo?.address}, {singleOrder.shippingInfo?.city},{' '}
            {singleOrder.shippingInfo?.state}, {singleOrder.shippingInfo?.pinCode}
          </p>

          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <table className="w-full mb-4 text-sm border border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Product ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {singleOrder.orderItems.map(item => (
                <tr key={item.product}>
                  <td className="p-2 border">{item.product}</td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{item.price}</td>
                  <td className="p-2 border">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <p className="font-medium text-gray-700 mb-2">
            <strong>Total Quantity:</strong> {totalQuantity}
          </p>
          <p className="font-bold text-lg">
            <strong>Total Price:</strong> ₹{singleOrder.totalPrice}
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderDetails;
