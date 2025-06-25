import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const newReviewSubmit = createAsyncThunk('new/review', async (reviewData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put('/api/v1/review', reviewData);
    return data.success;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'new review not created fail');
  }
});
