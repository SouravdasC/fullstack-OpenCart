import { newReviewSubmit } from '@/redux/thunk/reviewThunk/reviewThunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const newReviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewState: state => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: bulider => {
    bulider
      // new product review
      .addCase(newReviewSubmit.pending, state => {
        state.loading = true;
      })
      .addCase(newReviewSubmit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(newReviewSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewState } = newReviewSlice.actions;
export default newReviewSlice.reducer;
