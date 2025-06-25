
import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// update profile
export const updateProfile = createAsyncThunk('update/profile', async (userData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put('/api/v1/me/update', userData);
    return data.success;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Profile update failed');
  }
});

// update passord
export const updatePassword = createAsyncThunk(
  'updatePassword/profile',
  async (password, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put('/api/v1//password/update', password);
      return data.success;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Profile update password failed'
      );
    }
  }
);
