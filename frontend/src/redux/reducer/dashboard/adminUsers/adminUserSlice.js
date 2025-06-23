import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserRole,
} from '@/redux/thunk/dashboardThunk/adminUsersThunk/adminUsersThunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  singleUser: null,
  updatedUser: null,
  loading: false,
  error: null,
  success: false,
  otalUsers: 0,
  currentPage: 1,
  resultPerPage: 4,
  totalPages: 0,
  totalUsers: 0,
};

const adminUserSlice = createSlice({
  name: 'adminAllUser',
  initialState,
  reducers: {
    clearAdminUserState(state) {
      state.error = null;
      state.success = false;
      state.updatedUser = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // all user
      .addCase(getAllUsers.pending, state => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = {
          users: action.payload.users, // ✅ Actual array of users
          totalUsers: action.payload.totalUsers,
          currentPage: action.payload.currentPage,
          resultPerPage: action.payload.resultPerPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get single user
      .addCase(getSingleUser.pending, state => {
        state.loading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update user role
      .addCase(updateUserRole.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updatedUser = action.payload;
        state.singleUser = action.payload;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete user
      .addCase(deleteUser.pending, state => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.totalUsers -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminUserState, setCurrentPage } = adminUserSlice.actions;
export default adminUserSlice.reducer;
