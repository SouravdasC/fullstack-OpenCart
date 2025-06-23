import { createSlice } from '@reduxjs/toolkit';
import { updatePassword, updateProfile } from '../thunk/profileUpdateThunk';

const initialState = {
  loading: false,
  isUpdated: false,
  error: null,
};

const profileUpdateSlice = createSlice({
  name: 'profile update',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetUpdatedState: state => {
      state.isUpdated = false;
    },
  },
  extraReducers: bulider => {
    bulider
      // update profile
      .addCase(updateProfile.pending, state => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
      })

      // update password
      .addCase(updatePassword.pending, state => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetUpdatedState } = profileUpdateSlice.actions;
export default profileUpdateSlice.reducer;
