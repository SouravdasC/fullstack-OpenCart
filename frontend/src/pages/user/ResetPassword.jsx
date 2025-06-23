import MetaData from '@/components/layout/MetaData';
import { blue } from '@mui/material/colors';
import LockIcon from '@mui/icons-material/Lock';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { resetPassword } from '@/redux/thunk/passwordThunk/passwordThunk';
import { clearError, resetSuccess } from '@/redux/reducer/passwordReducer/passwordSlice';

function ResetPassword() {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isShowNew, setIsShowNew] = useState(true);
  const [isShowconfirm, setIsShowConfirm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useParams();

  const { loading, success, error } = useSelector(state => state.password);

  // for update password
  const handleUpdatePassword = e => {
    e.preventDefault();

    if (!token) {
      toast.error('Reset token is missing in URL');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const formData = {
      token,
      password,
      confirmPassword,
    };
    dispatch(resetPassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success) {
      toast.success('password reset successfully');
      dispatch(resetSuccess());
      navigate('/login');
    }
  }, [error, success, dispatch, navigate]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div>
          <MetaData title={`update profile`} />
          <div className="w-full h-auto max-w-md mx-auto p-6 bg-white shadow-md rounded-lg xl:my-10">
            <h2 className="text-black uppercase flex items-center justify-center my-4 border border-b-black">
              update profile
            </h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium flex items-center text-black">
                  <LockIcon sx={{ color: blue[500] }} /> Password
                </label>
                <div className="flex items-center justify-center">
                  <input
                    type={isShowNew ? 'password' : 'text'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                  <span
                    className="absolute right-3  cursor-pointer "
                    onClick={() => setIsShowNew(!isShowNew)}
                  >
                    {isShowNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                </div>
              </div>
              <div className="relative">
                <label className="text-sm font-medium flex items-center text-black">
                  <LockIcon sx={{ color: blue[500] }} /> Confirm Password
                </label>
                <div className="flex items-center justify-center">
                  <input
                    type={isShowconfirm ? 'password' : 'text'}
                    placeholder="Enter your confirm password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                  <span
                    className="absolute right-3  cursor-pointer "
                    onClick={() => setIsShowConfirm(!isShowconfirm)}
                  >
                    {isShowconfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                </div>
              </div>
              {/* button  */}
              <input
                type="submit"
                value="Reset Password"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded cursor-pointer hover:bg-green-500 transition-all duration-500 ease-in"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
