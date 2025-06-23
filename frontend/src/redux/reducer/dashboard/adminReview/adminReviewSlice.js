// src/redux/reducer/dashboard/adminReviews/adminReviewSlice.js
import {
  deleteReview,
  getAllReviews,
} from '@/redux/thunk/dashboardThunk/adminReviewsThunk/adminReviewThunk';
import { createSlice } from '@reduxjs/toolkit';

const adminReviewSlice = createSlice({
  name: 'adminReviews',
  initialState: {
    reviews: [],
    productName: '',
    loading: false,
    error: null,
    deletedReviewId: null,
  },
  reducers: {
    clearReviewError: state => {
      state.error = null;
    },
    clearDeletedReviewId: state => {
      state.deletedReviewId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllReviews.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = Array.isArray(action.payload.reviews) ? action.payload.reviews : []; // force to array
        state.productName = action.payload.productName;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReview.pending, state => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.deletedReviewId = action.payload;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError, clearDeletedReviewId } = adminReviewSlice.actions;
export default adminReviewSlice.reducer;
