import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all products
export const getProduct = createAsyncThunk('products/fetchAll', async (params = {}, thunkAPI) => {
  try {
    const { keyword = '', page = 1, price = [], category, ratings = 0 } = params;
    let link = `/api/v1/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

    if (category) link += `&category=${category}`;
    const { data } = await axiosInstance.get(link);

    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// product details
export const getProductDetails = createAsyncThunk('product/deatils', async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/product/${id}`);
    return data.product;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
