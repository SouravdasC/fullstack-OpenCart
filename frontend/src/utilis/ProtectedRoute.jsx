import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader2 from '@/components/shimmerEffect/Loader2';

const ProtectedRoute = ({ isAdminRoute = false }) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.user);

  if (loading) return <Loader2 />; // Optionally show a spinner or skeleton

  if (!isAuthenticated) {
    // Not logged in — redirect to login
    return <Navigate to="/login" replace />;
  }

  if (isAdminRoute && user.role !== 'admin') {
    // Logged in but not an admin — redirect to /account
    return <Navigate to="/account" replace />;
  }

  // Either user is authenticated (for general route) or is admin (for admin route)
  return <Outlet />;
};

export default ProtectedRoute;
