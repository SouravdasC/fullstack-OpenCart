// redux/reducer/contact/contactSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { deleteAdminMessage, fetchAllMessages, submitContactMessage } from '../thunk/contactThunk';

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    success: false,
    error: null,
    messages: [],
  },
  reducers: {
    clearContactState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitContactMessage.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(deleteAdminMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;
