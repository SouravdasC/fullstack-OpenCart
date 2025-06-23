import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import MetaData from '@/components/layout/MetaData';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import { getOrdersDetails } from '@/redux/thunk/orderThunk/orderThunk';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { order, error, loading } = useSelector(state => state.order);

  // for invoice
  const downloadInvoice = order => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 32);
    doc.text(`Status: ${order.orderStatus}`, 14, 40);
    doc.text(`Total Price: ₹${order.totalPrice}`, 14, 48);
    doc.text(`Customer: ${order.user.name}`, 14, 56);
    doc.text(`Email: ${order.user.email}`, 14, 64);

    if (order.shippingInfo) {
      doc.text(`Shipping Address:`, 14, 72);
      doc.text(
        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}, ${order.shippingInfo.country}`,
        14,
        80
      );
    }

    const tableData = order.orderItems.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `₹${item.price}`,
      `₹${item.quantity * item.price}`,
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['S/N', 'Product Name', 'Qty', 'Price', 'Total']],
      body: tableData,
    });

    doc.save(`invoice_${order._id}.pdf`);
  };

  // for error & order deatils
  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch order');
    }
    dispatch(getOrdersDetails(id));
  }, [dispatch, error, id]);

  const shipping = order?.shippingInfo;
  const isPaid = order?.paymentInfo?.status === 'succeeded';
  const isDelivered = order?.orderStatus?.toLowerCase() === 'delivered';

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <MetaData title={`Order Details - ${id}`} />
      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Order #: {order._id}</h2>

          {/* Shipping Info */}
          <div className="border p-4 rounded space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">Shipping Information</h3>
            <p>
              <strong>Name:</strong> {order.user?.name}
            </p>
            <p>
              <strong>Phone:</strong> {shipping?.phoneNo}
            </p>
            <p>
              <strong>Address:</strong>{' '}
              {`${shipping?.address}, ${shipping?.city}, ${shipping?.state}, ${shipping?.country} - ${shipping?.pinCode}`}
            </p>
          </div>

          {/* Payment & Order Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded shadow text-white ${isPaid ? 'bg-green-500' : 'bg-red-600'}`}
            >
              <h4 className="font-semibold text-lg">Payment Status</h4>
              <p>{isPaid ? 'PAID' : 'NOT PAID'}</p>
            </div>

            <div
              className={`p-4 rounded shadow ${
                isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              <h4 className="font-semibold text-lg">Order Status</h4>
              <p>{order.orderStatus}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded flex justify-around items-center">
            <p className="text-lg">
              <strong>Total Amount:</strong> ₹{order.totalPrice}
            </p>
            <div className=" ">
              <button
                onClick={() => downloadInvoice(order)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Download Invoice
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Ordered Items</h3>
            {order.orderItems?.map(item => (
              <div
                key={item.product}
                className="flex flex-col sm:flex-row items-center justify-between border-b py-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain border rounded"
                  />
                  <Link
                    to={`/product/${item.product}`}
                    className="text-blue-600 hover:underline text-base"
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="mt-2 sm:mt-0 text-sm">
                  {item.quantity} × ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
