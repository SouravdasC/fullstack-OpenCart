import MetaData from '@/components/layout/MetaData';
import { SkeletonCard } from '@/components/shimmerEffect/SkeletonCard';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black">
          <MetaData title={`${user?.name}'s profile`} />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl bg-white/20 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700 rounded-2xl shadow-lg p-6 md:p-10 text-gray-800 dark:text-white"
          >
            <h1 className="text-3xl font-bold text-center mb-10 capitalize">My Profile</h1>

            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Left Side: Profile Image + Button */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <img
                  src={user?.avatar?.url}
                  alt="Profile"
                  className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-white dark:border-gray-500 shadow-lg"
                />
                <Link
                  to="/me/update"
                  className="bg-red-500 hover:bg-amber-800 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out"
                >
                  Edit Profile
                </Link>
              </motion.div>

              {/* Right Side: Info */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1 w-full"
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold uppercase">Full Name</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">{user?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase">Email</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">{user?.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase">Joined On</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      {String(user.createdAt).substring(0, 10)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link
                    to="/orders"
                    className="flex-1 bg-gray-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md text-center"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/password/update"
                    className="flex-1 bg-gray-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md text-center"
                  >
                    Change Password
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <div>
            <h1>Admin Dashboard</h1>
            <h3>
              <p>Email:</p>test123@gmail.com
            </h3>
            <h3>
              <p>Password:</p>1234567890
            </h3>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
