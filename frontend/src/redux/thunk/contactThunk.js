// redux/thunk/contactThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// create message
export const submitContactMessage = createAsyncThunk(
  'contact/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/contact', formData);
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
      const { data } = await axios.get('/api/v1/admin/messages');
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
      await axios.delete(`/api/v1/admin/messages/${id}`);
      return id; // Return the ID so it can be removed from Redux store
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
