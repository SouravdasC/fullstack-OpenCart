import axios from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

//get all user
export const getAllUsers = createAsyncThunk('all/user', async ({ page = 1 }, thunkAPI) => {
  try {
    const { data } = await axios.get(`/api/v1/admin/users?page=${page}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'users not found');
  }
});

//get single user details
export const getSingleUser = createAsyncThunk('single/user', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/v1/admin/user/${id}`);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// update user
export const updateUserRole = createAsyncThunk(
  'update/user',
  async ({ id, formData }, thunkAPI) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${id}`, formData);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'user role updated failed');
    }
  }
);

//delete user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
  try {
    await axios.delete(`/api/v1/admin/user/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});
