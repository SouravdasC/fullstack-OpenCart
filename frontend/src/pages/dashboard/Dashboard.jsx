import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { FaBox, FaUsers, FaShoppingCart, FaMoneyBillWaveAlt } from 'react-icons/fa';

import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';
import MetaData from '@/components/layout/MetaData';
import { registerCharts } from '@/utilis/chartConfig';

import { clearDashboardError } from '@/redux/reducer/dashboard/adminDashboard/adminDashboardSlice';
import Loader2 from '@/components/shimmerEffect/Loader2';
import toast from 'react-hot-toast';
import { fetchAdminDashboardStats } from '@/redux/thunk/dashboardThunk/adminDashboardThunk/adminDashboardThunk';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.adminDashboard);

  registerCharts(); // for loading charts gloobal

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDashboardError());
    }
  }, [error, dispatch]);

  if (loading) return <Loader2 />;

  // Line Chart
  const lineState = {
    labels: ['Initial Amount', 'Amount Earned'],
    datasets: [
      {
        label: 'Total Amount',
        backgroundColor: '#f87171',
        borderColor: '#ef4444',
        data: stats.lineChartData || [0, 0],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: context => `₹${context.parsed.y}`,
        },
      },
      legend: { display: true, position: 'top' },
    },
    scales: {
      x: { title: { display: true, text: 'Metrics' } },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Amount (₹)' },
      },
    },
  };

  // Doughnut Chart
  const doughnutState = {
    labels: ['Out of Stock', 'In Stock'],
    datasets: [
      {
        data: [stats.stock?.outOfStock || 0, stats.stock?.inStock || 0],
        backgroundColor: ['#f87171', '#34d399'],
        borderWidth: 1,
      },
    ],
  };

  const summaryCards = [
    {
      icon: <FaMoneyBillWaveAlt className="text-red-500 text-3xl" />,
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue || 0}`,
      bg: 'bg-red-50 dark:bg-red-900/10',
    },
    {
      icon: <FaBox className="text-blue-500 text-3xl" />,
      label: 'Products',
      value: stats.totalProducts || 0,
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      link: '/admin/products',
    },
    {
      icon: <FaShoppingCart className="text-green-500 text-3xl" />,
      label: 'Orders',
      value: stats.totalOrders || 0,
      bg: 'bg-green-50 dark:bg-green-900/10',
      link: '/admin/orders',
    },
    {
      icon: <FaUsers className="text-purple-500 text-3xl" />,
      label: 'Users',
      value: stats.totalUsers || 0,
      bg: 'bg-purple-50 dark:bg-purple-900/10',
      link: '/admin/users',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
      <MetaData title="Admin Dashboard" />
      <DashboardSideBar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => {
            const Card = (
              <div
                className={`rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-all duration-300 ${card.bg}`}
              >
                {card.icon}
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{card.label}</p>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {card.value}
                </span>
              </div>
            );
            return card.link ? (
              <Link to={card.link} key={index}>
                {Card}
              </Link>
            ) : (
              <div key={index}>{Card}</div>
            );
          })}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Revenue Overview
            </h2>
            <Line data={lineState} options={lineOptions} />
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Stock Distribution
            </h2>
            <Doughnut data={doughnutState} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
