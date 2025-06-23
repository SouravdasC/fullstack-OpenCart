import axios from '@/utilis/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const addItemsToCart = createAsyncThunk(
  'addItemsToCart/cart',
  async ({ id, quantity }, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'cart items added failed');
    }
  }
);
