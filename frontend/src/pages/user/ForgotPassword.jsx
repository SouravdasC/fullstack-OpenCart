// components/pages/ForgotPassword.jsx
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import { blue } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MetaData from '@/components/layout/MetaData';
import { forgotPassword } from '@/redux/thunk/passwordThunk/passwordThunk';
import toast from 'react-hot-toast';
import { clearError } from '@/redux/reducer/passwordReducer/passwordSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();

  const { loading, message, error } = useSelector(state => state.password);

  // 📧 Email validation function
  const validateEmail = email => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleForgotPassword = e => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message, dispatch]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <>
          <MetaData title="Forgot Password" />
          <div className="w-full h-auto max-w-md mx-auto p-6 bg-white shadow-md rounded-lg xl:my-10">
            <h2 className="text-black uppercase flex items-center justify-center my-4 border-b pb-2 font-bold">
              Forgot Password
            </h2>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center text-black">
                  <EmailOutlinedIcon sx={{ color: blue[500], marginRight: '5px' }} />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border p-2 rounded text-black"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <input
                type="submit"
                value={loading ? 'Sending...' : 'Send Reset Link'}
                disabled={loading}
                className={`w-full font-semibold py-2 rounded cursor-pointer transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
