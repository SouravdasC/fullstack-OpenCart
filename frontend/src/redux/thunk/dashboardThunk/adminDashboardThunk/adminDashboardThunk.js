import axios from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/dashboard', { withCredentials: true });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
