import React, { useEffect } from 'react';
import MetaData from '@/components/layout/MetaData';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { clearError } from '@/redux/reducer/order/orderslice';
import { myOrders } from '@/redux/thunk/orderThunk/orderThunk';

const Orders = () => {
  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector(state => state.order);
  const { user } = useSelector(state => state.user);
  const isMobile = window.innerWidth <= 768;

  // for download invoice
  const downloadInvoice = order => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 32);
    doc.text(`Status: ${order.orderStatus}`, 14, 40);
    doc.text(`Total Price: ₹${order.totalPrice}`, 14, 48);
    doc.text(`Customer: ${user.name}`, 14, 56);
    doc.text(`Email: ${user.email}`, 14, 64);

    if (order.shippingInfo) {
      doc.text('Shipping Address:', 14, 72);
      doc.text(
        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`,
        14,
        80
      );
    }

    const tableData = order.orderItems.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `₹${item.price}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['S/N', 'Product Name', 'Qty', 'Price']],
      body: tableData,
    });

    doc.save(`invoice_${order._id}.pdf`);
  };

  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 0.5 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: params => {
        const status = params.value.toLowerCase();
        let bgColor = 'bg-blue-100 text-blue-800';
        if (status === 'processing') bgColor = 'bg-red-100 text-red-800';
        else if (status === 'delivered') bgColor = 'bg-green-100 text-green-800';

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
            {params.value}
          </span>
        );
      },
    },
    { field: 'itemsQty', headerName: 'Items Qty', type: 'number', flex: 0.5 },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: params => (
        <Link to={`/order/${params.row.id}`} className="text-blue-600 hover:underline">
          <LaunchIcon />
        </Link>
      ),
    },
    {
      field: 'invoice',
      headerName: 'Invoice',
      flex: 0.5,
      sortable: false,
      renderCell: params => (
        <button
          className="text-green-600 hover:underline"
          onClick={() => downloadInvoice(params.row.raw)}
        >
          Download
        </button>
      ),
    },
  ];

  const rows =
    orders?.map(order => ({
      id: order._id,
      status: order.orderStatus,
      itemsQty: order.orderItems.length,
      amount: order.totalPrice,
      raw: order,
    })) || [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch orders');
      dispatch(clearError());
    }
    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <div>
      <MetaData title={`${user?.name} - Orders`} />
      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="max-w-3xl mx-auto p-6">
          <Typography variant="h5" className="mb-4">{`${user?.name}'s Orders`}</Typography>

          {isMobile ? (
            <div className="space-y-4">
              {orders.map(order => {
                const statusColor =
                  order.orderStatus.toLowerCase() === 'delivered'
                    ? 'text-red-600'
                    : order.orderStatus.toLowerCase() === 'processing'
                    ? 'text-green-600'
                    : 'text-blue-600';

                return (
                  <details key={order._id} className="bg-gray-100 p-4 rounded-md shadow">
                    <summary className="font-semibold cursor-pointer">
                      Order ID: {order._id}
                    </summary>
                    <div className="mt-2 space-y-2 text-sm">
                      <p className={statusColor}>Status: {order.orderStatus}</p>
                      <p>Items: {order.orderItems.length}</p>
                      <p>Total: ₹{order.totalPrice}</p>
                      <Link
                        to={`/order/${order._id}`}
                        className="text-blue-500 hover:underline inline-block"
                      >
                        View Order
                      </Link>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="text-green-600 hover:underline"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <Box sx={{ height: 420, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5]}
                autoPageSize
                disableRowSelectionOnClick
              />
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
