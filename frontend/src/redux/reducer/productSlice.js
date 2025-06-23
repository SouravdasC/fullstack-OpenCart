// src/redux/slices/productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getProduct, getProductDetails } from '../thunk/productThunk';

const initialState = {
  products: [],
  productDetails: {},
  reviews: [],
  productsCount: 0,
  resultPerPage: 0,
  minPrice: 0,
  maxPrice: 0,
  filteredProductsCount: 0,
  adminProducts: [],
  loading: false,
  error: null,
  success: false,
  isUpdated: false,
  isDeleted: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetSuccess(state) {
      state.success = false;
    },
    resetUpdate(state) {
      state.isUpdated = false;
    },
    resetDelete(state) {
      state.isDeleted = false;
    },
  },
  extraReducers: builder => {
    builder
      // All Products
      .addCase(getProduct.pending, state => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductsCount = action.payload.filteredProductsCount;
        state.minPrice = action.payload.minPrice;
        state.maxPrice = action.payload.maxPrice;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Product Details
      .addCase(getProductDetails.pending, state => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { clearError, resetSuccess, resetUpdate, resetDelete } = productSlice.actions;

export default productSlice.reducer;
