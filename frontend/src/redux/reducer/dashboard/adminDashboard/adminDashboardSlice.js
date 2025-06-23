// src/redux/reducer/dashboard/adminDashboardSlice.js
import { fetchAdminDashboardStats } from '@/redux/thunk/dashboardThunk/adminDashboardThunk/adminDashboardThunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  stats: {
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    stock: {
      inStock: 0,
      outOfStock: 0,
    },
    lineChartData: [],
  },
  error: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearDashboardError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminDashboardStats.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
