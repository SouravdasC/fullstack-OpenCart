import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const newReviewSubmit = createAsyncThunk('new/review', async (reviewData, thunkAPI) => {
  try {
    const { data } = await axios.put('/api/v1/review', reviewData);
    return data.success;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'new review not created fail');
  }
});
