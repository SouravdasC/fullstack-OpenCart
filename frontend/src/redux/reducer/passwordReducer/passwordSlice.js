import { forgotPassword, resetPassword } from '@/redux/thunk/passwordThunk/passwordThunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  success: false,
  message: null,
  error: null,
};

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetSuccess: state => {
      state.success = false;
    },
  },
  extraReducers: bulider => {
    bulider
      // forgot password
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // reset password
      .addCase(resetPassword.pending, state => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess } = passwordSlice.actions;
export default passwordSlice.reducer;
