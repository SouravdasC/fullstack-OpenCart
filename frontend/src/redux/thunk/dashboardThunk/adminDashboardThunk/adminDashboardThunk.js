import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/dashboard');
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
