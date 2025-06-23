import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';
import PaginationCom from '@/components/pagination/PaginationCom';
import toast from 'react-hot-toast';
import MetaData from '@/components/layout/MetaData';
import {
  adminDeleteOrder,
  getAllOrders,
} from '@/redux/thunk/dashboardThunk/adminOrdersThunk/adminOrderThunk';
import {
  clearAdminOrderState,
  removeOrderFromList,
  setOrderToUpdate,
} from '@/redux/reducer/dashboard/adminOrders/adminOrderSlice';
import UpdateOrderForm from './UpdateOrderForm';
import { Link } from 'react-router-dom';

const AdminOrdersList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, success, orderToEdit } = useSelector(state => state.adminOrder);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    dispatch(getAllOrders({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success('Order updated/deleted successfully');
      dispatch(clearAdminOrderState());
    }

    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch]);

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const res = await dispatch(adminDeleteOrder(id));

        if (res?.meta?.requestStatus === 'fulfilled') {
          dispatch(removeOrderFromList(id));
          toast.success('Order deleted successfully');
        } else {
          toast.error(res?.payload || 'Failed to delete order');
        }
      } catch (err) {
        toast.error(err || 'Unexpected error while deleting order');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) return;

    if (window.confirm(`Delete ${selectedOrders.length} selected orders?`)) {
      for (const id of selectedOrders) {
        await dispatch(adminDeleteOrder(id));
        dispatch(removeOrderFromList(id));
      }
      toast.success(`${selectedOrders.length} orders deleted`);
      setSelectedOrders([]);
    }
  };

  const toggleOrderSelection = id => {
    setSelectedOrders(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleSelectAll = checked => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleEdit = order => {
    dispatch(setOrderToUpdate(order));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredOrders = useMemo(() => {
    let list = orders?.orders || [];

    if (search) {
      list = list.filter(order => order._id.toLowerCase().includes(search.toLowerCase()));
    }

    if (statusFilter !== 'All') {
      list = list.filter(order => order.orderStatus === statusFilter);
    }

    return list;
  }, [orders, search, statusFilter]);

  return (
    <div className="flex w-full flex-col lg:flex-row">
      <MetaData title="Admin Orders" />
      <DashboardSideBar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Admin Orders</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="px-4 py-2 border rounded-md w-full sm:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md w-full sm:w-52"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Bulk Delete Button */}
        {selectedOrders.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200"
          >
            Delete {selectedOrders.length} Selected
          </button>
        )}

        {/* Summary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="px-4 py-2 border rounded shadow bg-white">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-blue-700">{orders?.ordersCount || 0}</p>
          </div>
          <div className="px-4 py-2 border rounded shadow bg-white">
            <p className="text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-green-700">₹{orders?.totalAmount || 0}</p>
          </div>
          <div className="p-4 border rounded shadow bg-white">
            <p className="text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-purple-700">
              {orders?.orders?.reduce((total, order) => total + order.orderItems?.length, 0) || 0}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-lg shadow border">
          <table className="min-w-full text-sm text-left bg-white border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="p-3 border text-center">
                  <input
                    type="checkbox"
                    onChange={e => handleSelectAll(e.target.checked)}
                    checked={
                      selectedOrders.length === filteredOrders.length && filteredOrders.length > 0
                    }
                  />
                </th>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Payment</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredOrders.length > 0 ? (
                <AnimatePresence>
                  {filteredOrders.map(order => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleOrderSelection(order._id)}
                        />
                      </td>
                      <td className="p-3 border text-blue-600 underline">
                        <Link to={`/admin/order/${order._id}`}>{order._id}</Link>
                      </td>
                      <td className="p-3 border">{order.user?.name || 'N/A'}</td>
                      <td className="p-3 border">₹{order.totalPrice}</td>
                      <td className="p-3 border">{order.paymentInfo?.status || 'Unpaid'}</td>
                      <td
                        className={`p-3 rounded-full text-sm font-semibold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.orderStatus === 'Processing'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.orderStatus}
                      </td>
                      <td className="p-3 border">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border text-center">
                        <div className="flex justify-center gap-3 flex-wrap">
                          <button
                            onClick={() => handleEdit(order)}
                            className={`text-blue-600 hover:text-blue-800 cursor-pointer ${
                              order.orderStatus === 'Delivered' ? 'hidden' : 'block'
                            }`}
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500">
                    {loading ? 'Loading orders...' : 'No orders match the filter'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Update Order Form */}
        {orderToEdit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <UpdateOrderForm
              order={orderToEdit}
              onSuccess={() => dispatch(clearAdminOrderState())}
            />
          </motion.div>
        )}

        {/* Pagination */}
        <div className="mt-10">
          <PaginationCom
            productsCount={orders?.ordersCount}
            resultPerPage={orders?.resultPerPage}
            currentPage={orders?.currentPage}
            setCurrentPage={setCurrentPage}
            filteredProductsCount={orders?.ordersCount}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersList;
