import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdminMessage, fetchAllMessages } from '@/redux/thunk/contactThunk';
import MetaData from '@/components/layout/MetaData';
import DashboardSideBar from '@/components/dashboardCom/DashboardSideBar';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Utility for timestamp formatting
const formatDate = iso =>
  new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector(state => state.contact);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllMessages());
  }, [dispatch]);

  const handleDelete = id => {
    dispatch(deleteAdminMessage(id))
      .unwrap()
      .then(() => toast.success('Message deleted'))
      .catch(err => toast.error(err));
  };

  const filteredMessages = useMemo(() => {
    return (
      messages?.filter(
        msg =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [messages, searchTerm]);

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * messagesPerPage;
    return filteredMessages.slice(start, start + messagesPerPage);
  }, [filteredMessages, currentPage]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">
      <MetaData title="Admin - User Messages" />
      <DashboardSideBar />

      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          User Messages
        </h1>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md mb-6 p-2 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        {/* No messages found */}
        {filteredMessages.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No messages found.</p>
        ) : (
          <>
            {/* Message grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedMessages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white dark:bg-slate-800 p-4 rounded-xl shadow hover:shadow-md transition-all group"
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                    <span className="font-semibold">From:</span> {msg.name}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-semibold">Email:</span> {msg.email}
                  </p>

                  {msg.user && (
                    <p className="text-sm mb-1">
                      <Link
                        to={`/admin/user/${msg.user._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View User Profile
                      </Link>
                    </p>
                  )}

                  <p className="text-sm italic text-gray-700 dark:text-gray-300 mb-2">
                    “{msg.message}”
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Sent: {formatDate(msg.createdAt)}
                  </p>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border text-sm ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminMessages;
