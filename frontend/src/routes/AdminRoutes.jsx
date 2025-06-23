// src/routes/AdminRoutes.js
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../utilis/ProtectedRoute';
import Loader2 from '@/components/shimmerEffect/Loader2';

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const ProductsList = lazy(() => import('../pages/dashboard/ProductsList'));
const CreateProduct = lazy(() => import('../pages/dashboard/CreateProduct'));
const AdminOrdersList = lazy(() => import('@/pages/dashboard/AdminOrdersList'));
const AdminOrderDetails = lazy(() => import('@/pages/dashboard/AdminOrderDetails'));
const AdminUserDetails = lazy(() => import('@/pages/dashboard/AdminUserDetails'));
const AdminUserList = lazy(() => import('@/pages/dashboard/AdminUserList'));
const AdminReviews = lazy(() => import('@/pages/dashboard/AdminReviews'));
const AdminMessages = lazy(() => import('@/pages/dashboard/AdminMessages'));

const AdminRoutes = () => (
  <>
    <Routes>
      {/* ✅ Admin Protected Routes */}
      <Route element={<ProtectedRoute isAdminRoute={true} />}>
        {/* //dahsboard */}
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<Loader2 />}>
              <Dashboard />
            </Suspense>
          }
        />
        {/* //product list  */}
        <Route
          path="/admin/products"
          element={
            <Suspense fallback={<Loader2 />}>
              <ProductsList />
            </Suspense>
          }
        />
        {/* product created  */}
        <Route
          path="/admin/product/create"
          element={
            <Suspense fallback={<Loader2 />}>
              <CreateProduct />
            </Suspense>
          }
        />
        {/* orders list  */}
        <Route
          path="/admin/orders"
          element={
            <Suspense fallback={<Loader2 />}>
              <AdminOrdersList />
            </Suspense>
          }
        />
        {/* single orders details  */}
        <Route
          path="/admin/order/:id"
          element={
            <Suspense fallback={<Loader2 />}>
              <AdminOrderDetails />
            </Suspense>
          }
        />
        {/* user list  */}
        <Route
          path="/admin/users"
          element={
            <Suspense fallback={<Loader2 />}>
              <AdminUserList />
            </Suspense>
          }
        />
        {/* single user details  */}
        <Route
          path="/admin/user/:id"
          element={
            <Suspense fallback={<Loader2 />}>
              <AdminUserDetails />
            </Suspense>
          }
        />
        {/* reviews  */}
        <Route
          path="/admin/analytics"
          element={
            <Suspense fallback={<Loader2 />}>
              <AdminReviews />
            </Suspense>
          }
        />
        {/* reviews  */}
        <Route
          path="/admin/messages"
          element={
            <Suspense fallback={<Loader2 />}>
              <AdminMessages />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  </>
);

export default AdminRoutes;
