import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// login user
export const login = createAsyncThunk('login/user', async ({ email, password }, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/api/v1/login', { email, password });
    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// register user
export const register = createAsyncThunk('register/user', async (userdata, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/api/v1/register', userdata);

    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// load user
export const loadUser = createAsyncThunk('load/user', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/api/v1/me');
    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// logout user
export const logout = createAsyncThunk('logout/user', async (_, thunkAPI) => {
  try {
    await axiosInstance.get('/api/v1/logout');
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
