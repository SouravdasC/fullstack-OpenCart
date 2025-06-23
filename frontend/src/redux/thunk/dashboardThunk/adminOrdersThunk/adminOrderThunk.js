import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// all orders
export const getAllOrders = createAsyncThunk('get/orders', async ({ page = 1 }, thunkAPI) => {
  try {
    const { data } = await axios.get(`/api/v1//admin/orders?page=${page}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// admin single order deatils
export const fetchSingleOrder = createAsyncThunk(
  'single/order',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${id}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load order');
    }
  }
);

// update orders
export const adminUpdateOrder = createAsyncThunk(
  'update/orders',
  async ({ id, status }, thunkAPI) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/order/${id}`, { status });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// delete orders
export const adminDeleteOrder = createAsyncThunk('delete/orders', async (id, thunkAPI) => {
  try {
    const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
