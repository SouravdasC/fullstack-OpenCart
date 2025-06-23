// src/routes/UserRoutes.js
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('../pages/Home'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Allproducts = lazy(() => import('../pages/Allproducts'));
const Search = lazy(() => import('../components/searchProduct/Search'));
const LoginSignup = lazy(() => import('../pages/user/LoginSignup'));
const Profile = lazy(() => import('../pages/user/Profile'));
const ProfileUpdate = lazy(() => import('../pages/user/ProfileUpdate'));
const UpdatePassword = lazy(() => import('../pages/user/UpdatePassword'));
const ForgotPassword = lazy(() => import('../pages/user/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/user/ResetPassword'));
const Cart = lazy(() => import('../pages/cart/Cart'));
const ShippingInfo = lazy(() => import('../pages/cart/ShippingInfo'));
const ConfirmOrder = lazy(() => import('../pages/cart/ConfirmOrder'));
const Payments = lazy(() => import('../pages/cart/Payments'));
const OrderSuccess = lazy(() => import('../pages/cart/OrderSuccess'));
const Orders = lazy(() => import('../pages/cart/Orders'));
const OrderDetails = lazy(() => import('../pages/cart/OrderDetails'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const UserRoutes = ({ stripeApiKey }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/products" element={<Allproducts />} />
      <Route path="/products/:keyword" element={<Allproducts />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/account" element={<Profile />} />
      <Route path="/me/update" element={<ProfileUpdate />} />
      <Route path="/password/update" element={<UpdatePassword />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shipping" element={<ShippingInfo />} />
      <Route path="/order/confirm" element={<ConfirmOrder />} />
      <Route path="/success" element={<OrderSuccess />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      {stripeApiKey && (
        <Route
          path="/process/payment"
          element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Payments />
            </Elements>
          }
        />
      )}
    </Routes>
  </Suspense>
);

export default UserRoutes;
