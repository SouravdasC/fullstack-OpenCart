import { useEffect, useState } from 'react';

import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import UserOptions from './components/UserOptions';
import { useSelector } from 'react-redux';
import { store } from './redux/store';
import { loadUser } from './redux/thunk/userThunk';

import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import axios from './utilis/axios';
import { Analytics } from '@vercel/analytics/react';
import Loader2 from './components/shimmerEffect/Loader2';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import ProductsList from './pages/dashboard/ProductsList';
import CreateProduct from './pages/dashboard/CreateProduct';
import AdminOrdersList from './pages/dashboard/AdminOrdersList';
import AdminOrderDetails from './pages/dashboard/AdminOrderDetails';
import AdminUsersList from './pages/dashboard/AdminUserList';
import AdminUserDetails from './pages/dashboard/AdminUserDetails';
import AdminReviews from './pages/dashboard/AdminReviews';
import AdminMessages from './pages/dashboard/AdminMessages';

function App() {
  const { isAuthenticated, user, loading } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState();

  const getStripeApiKey = async () => {
    try {
      const { data } = await axios.get('/api/v1/stripeapikey');
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error('Failed to fetch Stripe API Key:', error);
    }
  };
  // console.log('Stripe Key: ', stripeApiKey);

  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  if (loading) return <Loader2 />;

  return (
    <>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <div className="my-[90px]">
        {/* user  */}
        <UserRoutes stripeApiKey={stripeApiKey} />
        {/* admin  */}
        {/* <AdminRoutes /> */}
        <Routes>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsList />} />
          <Route path="/admin/product/create" element={<CreateProduct />} />
          <Route path="/admin/orders" element={<AdminOrdersList />} />
          <Route path="/admin/order/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/users" element={<AdminUsersList />} />
          <Route path="/admin/user/:id" element={<AdminUserDetails />} />
          <Route path="/admin/analytics" element={<AdminReviews />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
        </Routes>
        <Analytics />
      </div>
      <Footer />
    </>
  );
}

export default App;
