// components/contact/ContactPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { submitContactMessage } from '@/redux/thunk/contactThunk';
import { clearContactState } from '@/redux/reducer/contactSlice';

const ContactPage = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.contact);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(submitContactMessage(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success('Message sent successfully');
      dispatch(clearContactState());
      setFormData({ name: '', email: '', message: '' });
    }
    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [success, error, dispatch]);

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl max-w-xl mx-auto space-y-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 rounded border dark:bg-slate-700"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-2 rounded border dark:bg-slate-700"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows="5"
          className="w-full p-2 rounded border dark:bg-slate-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50 w-full"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactPage;
