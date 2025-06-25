// redux/thunk/contactThunk.js
import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// create message
export const submitContactMessage = createAsyncThunk(
  'contact/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/contact', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//admin get all message
export const fetchAllMessages = createAsyncThunk(
  'contact/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/v1/admin/messages');
      return data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//delete message
export const deleteAdminMessage = createAsyncThunk(
  'contact/deleteAdminMessage',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/admin/messages/${id}`);
      return id; // Return the ID so it can be removed from Redux store
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
