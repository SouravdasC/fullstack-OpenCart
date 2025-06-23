// src/redux/thunk/dashboardThunk/adminReviewThunks.js

import axios from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Get all reviews of a specific product
export const getAllReviews = createAsyncThunk(
  'admin/getAllReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/review/${productId}`);
      return { productName: data.productName, reviews: data.reviews };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/reviews`, {
        params: { productId, id: reviewId },
      });
      return { productId, reviewId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
