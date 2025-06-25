import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// forgot password
export const forgotPassword = createAsyncThunk('forgot/password', async (email, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/api/v1/password/forgot', { email });
    return data.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
  }
});

// reset password
export const resetPassword = createAsyncThunk(
  'reset/password',
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`/api/v1/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      return data.success;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send reset password link'
      );
    }
  }
);
