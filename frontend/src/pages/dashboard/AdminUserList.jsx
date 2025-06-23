import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import {
  deleteUser,
  getAllUsers,
} from '@/redux/thunk/dashboardThunk/adminUsersThunk/adminUsersThunk';
import { clearAdminUserState } from '@/redux/reducer/dashboard/adminUsers/adminUserSlice';

import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';
import PaginationCom from '@/components/pagination/PaginationCom';

const AdminUsersList = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector(state => state.adminUsers);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(getAllUsers({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success('Action completed');
      dispatch(clearAdminUserState());
      setSelectedUsers([]);
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch]);

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleBulkDelete = () => {
    if (
      selectedUsers.length &&
      window.confirm(`Delete ${selectedUsers.length} selected user(s)?`)
    ) {
      selectedUsers.forEach(id => dispatch(deleteUser(id)));
    }
  };

  const toggleSelect = id => {
    setSelectedUsers(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users?.users)) return [];
    return users.users.filter(
      user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <DashboardSideBar />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
            All Users
          </h2>

          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Selected ({selectedUsers.length})
            </button>
          )}
        </div>

        <div className="mb-4 max-w-md w-full">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={e =>
                      setSelectedUsers(e.target.checked ? filteredUsers.map(user => user._id) : [])
                    }
                    checked={filteredUsers.length && selectedUsers.length === filteredUsers.length}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {!loading && filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleSelect(user._id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {user.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-600 dark:bg-red-600 dark:text-white'
                              : 'bg-green-100 text-green-600 dark:bg-green-600 dark:text-white'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition duration-150"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {loading ? 'Loading users...' : 'No users found'}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <PaginationCom
            resultPerPage={users?.resultPerPage}
            productsCount={users?.totalUsers}
            currentPage={users?.currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminUsersList;
