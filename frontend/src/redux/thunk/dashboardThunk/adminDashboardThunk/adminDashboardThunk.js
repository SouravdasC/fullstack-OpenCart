import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/v1/admin/dashboard');
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
