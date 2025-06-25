import axios from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/v1/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
