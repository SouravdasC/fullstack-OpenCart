import { createSlice } from '@reduxjs/toolkit';
import { loadUser, login, logout, register } from '../thunk/userThunk';
import toast from 'react-hot-toast';

const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearErrors: state => {
      state.error = null;
    },
  },
  extraReducers: bulider => {
    bulider
      // login user
      .addCase(login.pending, state => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        toast.success('Login successfully');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        toast.error('login failed');
      })

      // register user
      .addCase(register.pending, state => {
        state.loading = true;
        state.isAuthenticated = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        toast.success('user register  successfully');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
        toast.error('user register failed');
      })

      //load user
      .addCase(loadUser.pending, state => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // logout user
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
