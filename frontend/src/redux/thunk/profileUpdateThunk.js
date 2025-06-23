import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// update profile
export const updateProfile = createAsyncThunk('update/profile', async (userData, thunkAPI) => {
  try {
    const { data } = await axios.put('/api/v1/me/update', userData, { withCredentials: true });
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
      const { data } = await axios.put('/api/v1//password/update', password);
      return data.success;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Profile update password failed'
      );
    }
  }
);
