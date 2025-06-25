import axiosInstance from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Get all admin products
export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchAll',
  async (params = {}, thunkAPI) => {
    try {
      const { keyword = '', page = 1 } = params;
      let link = `/api/v1/products?keyword=${keyword}&page=${page}`;

      const { data } = await axiosInstance.get(link);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//create product
export const adminCreateProduct = createAsyncThunk(
  'create/product',
  async (productData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/admin/product/new', productData);
      return {
        success: data.success,
        product: data.product,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'product created failed');
    }
  }
);

// update product
export const adminUpdateProduct = createAsyncThunk(
  'update/product',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`/api/v1/admin/product/${id}`, updatedData);
      return data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'product updated failed');
    }
  }
);

//delete product
export const adminDeleteProduct = createAsyncThunk('delete/product', async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.delete(`/api/v1/admin/product/${id}`);
    return data.product;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'product delete failed');
  }
});
