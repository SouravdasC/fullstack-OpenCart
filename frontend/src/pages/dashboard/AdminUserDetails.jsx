import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import {
  getSingleUser,
  updateUserRole,
} from '@/redux/thunk/dashboardThunk/adminUsersThunk/adminUsersThunk';
import { clearAdminUserState } from '@/redux/reducer/dashboard/adminUsers/adminUserSlice';

import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';

const AdminUserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleUser, updatedUser, loading } = useSelector(state => state.adminUsers);

  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [originalData, setOriginalData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleUser) {
      setRole(singleUser.role);
      setName(singleUser.name);
      setEmail(singleUser.email);
      setPreviewUrl(singleUser.avatar?.url || '');
      setOriginalData({
        name: singleUser.name,
        email: singleUser.email,
        role: singleUser.role,
      });
    }
  }, [singleUser]);

  useEffect(() => {
    if (updatedUser) {
      toast.success('User updated successfully');
      dispatch(getSingleUser(id));
      dispatch(clearAdminUserState());
      setSelectedImage(null);
    }
  }, [updatedUser, dispatch, id]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    const noChanges =
      name === originalData.name &&
      email === originalData.email &&
      role === originalData.role &&
      !selectedImage;

    if (noChanges) {
      toast('No changes made');
      return;
    }

    const formData = new FormData();
    formData.append('role', role);
    formData.append('name', name);
    formData.append('email', email);
    if (selectedImage) formData.append('avatar', selectedImage);
    dispatch(updateUserRole({ id, formData }));
  };

  const handleReset = () => {
    setName(originalData.name);
    setEmail(originalData.email);
    setRole(originalData.role);
    setSelectedImage(null);
    setPreviewUrl(singleUser.avatar?.url || '');
    toast.success('Reset to original');
  };

  const isMainAdmin = singleUser?.email === 'mainadmin@example.com';

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <DashboardSideBar />
      <main className="flex-1 p-4 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-200 border-b pb-4 mb-6">
          Edit User Details
        </h2>

        {singleUser ? (
          <motion.div
            className="flex flex-col lg:flex-row-reverse gap-10 items-center justify-around"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Profile update section */}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-center mb-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Image</p>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 mx-auto hover:scale-105 transition"
                  />
                </a>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload New Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Change Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  disabled={isMainAdmin}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-60"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`w-full px-4 py-2 rounded text-white font-semibold ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition`}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 rounded border border-gray-400 text-gray-700 dark:text-white dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Editable details section */}
            <div className="w-full max-w-md text-gray-800 dark:text-gray-200 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">User ID:</label>
                <p className="break-all text-sm text-gray-600 dark:text-gray-400">
                  {singleUser.role}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">User ID:</label>
                <p className="break-all text-sm text-gray-600 dark:text-gray-400">
                  {singleUser._id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Created At:</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(singleUser.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Updated:</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(singleUser.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading user...</p>
        )}
      </main>
    </div>
  );
};

export default AdminUserDetails;
