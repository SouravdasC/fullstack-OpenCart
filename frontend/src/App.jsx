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

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
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

  return (
    <>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <div className="my-[90px]">
        {/* user  */}
        <UserRoutes stripeApiKey={stripeApiKey} />
        {/* admin  */}
        <AdminRoutes />
      </div>
      <Footer />
    </>
  );
}

export default App;
