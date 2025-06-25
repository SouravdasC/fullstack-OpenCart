import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// create new order
export const createOrder = createAsyncThunk('create/order', async (orderData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/api/v1/order/new', orderData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'new order not created');
  }
});

// my orders
export const myOrders = createAsyncThunk('my/order', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/api/v1/orders/me');
    return data.userOrders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'order details not found');
  }
});

//get order details
export const getOrdersDetails = createAsyncThunk('details/order', async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/order/${id}`);
    return data.order;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'order details not found');
  }
});
