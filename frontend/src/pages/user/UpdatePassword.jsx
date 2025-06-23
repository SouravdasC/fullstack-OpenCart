import MetaData from '@/components/layout/MetaData';
import { updatePassword } from '@/redux/thunk/profileUpdateThunk';
import { blue } from '@mui/material/colors';
import LockIcon from '@mui/icons-material/Lock';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError } from '@/redux/reducer/profileUpdateSlice';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isShowOld, setIsShowOld] = useState(true);
  const [isShowNew, setIsShowNew] = useState(true);
  const [isShowconfirm, setIsShowConfirm] = useState(true);
  // const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated, loading } = useSelector(state => state.profileUpdate);

  // Password validation
  // const validatePasswords = () => {
  //   const newErrors = {};

  //   if (!oldPassword) newErrors.oldPassword = 'Old password is required.';
  //   if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 8 characters.';
  //   if (!/\d/.test(newPassword)) newErrors.newPassword = 'Password must include a number.';
  //   if (!/[!@#$%^&*]/.test(newPassword))
  //     newErrors.newPassword = 'Password must include a special character.';
  //   if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // for update password
  const handleUpdatePassword = e => {
    e.preventDefault();
    // if (!validatePasswords()) return;
    const formData = {
      oldPassword,
      newPassword,
      confirmPassword,
    };
    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }

    if (isUpdated) {
      toast.success('profile password updated successfully');

      navigate('/account');
    }
  }, [error, isUpdated, navigate, dispatch]);

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
                  <LockIcon sx={{ color: blue[500] }} /> Old Password
                </label>
                <div className="flex items-center justify-center">
                  <input
                    type={isShowOld ? 'password' : 'text'}
                    placeholder="Enter your old password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                  <span
                    className="absolute right-3  cursor-pointer "
                    onClick={() => setIsShowOld(!isShowOld)}
                  >
                    {isShowOld ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  {/* {errors.oldPassword && (
                    <p className="text-red-500 text-sm">{errors.oldPassword}</p>
                  )} */}
                </div>
              </div>
              <div className="relative">
                <label className="text-sm font-medium flex items-center text-black">
                  <LockIcon sx={{ color: blue[500] }} /> New Password
                </label>
                <div className="flex items-center justify-center">
                  <input
                    type={isShowNew ? 'password' : 'text'}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="w-full border p-2 rounded text-black"
                  />
                  <span
                    className="absolute right-3  cursor-pointer "
                    onClick={() => setIsShowNew(!isShowNew)}
                  >
                    {isShowNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  {/* {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                  )} */}
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
                  {/* {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )} */}
                </div>
              </div>
              {/* button  */}
              <input
                type="submit"
                value="Update Password"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded cursor-pointer hover:bg-green-500 transition-all duration-500 ease-in"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePassword;
