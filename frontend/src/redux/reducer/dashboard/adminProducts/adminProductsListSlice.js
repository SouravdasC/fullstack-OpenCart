import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
  fetchAdminProducts,
} from '@/redux/thunk/dashboardThunk/adminProductThunks/adminProductThunks';
import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  products: {}, // complete products object from API
  loading: false,
  error: null,
  updateProduct: null, // product currently being edited
  success: false,
};

const adminProductSlice = createSlice({
  name: 'adminProduct',
  initialState,
  reducers: {
    clearAdminProductState(state) {
      state.loading = false;
      state.error = null;
      state.updateProduct = null;
    },
    setUpdateProduct(state, action) {
      // console.log('Setting updateProduct in reducer:', action.payload);
      state.updateProduct = action.payload;
    },
    removeProductFromList: (state, action) => {
      state.products.products = state.products.products.filter(
        product => product._id !== action.payload
      );
      state.products.productsCount -= 1;
      state.products.filteredProductsCount -= 1;
    },
  },
  extraReducers: builder => {
    builder
      // All Products
      .addCase(fetchAdminProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(adminCreateProduct.pending, state => {
        state.loading = true;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.products?.unshift(action.payload); // Add new product to beginning
        toast.success('Product created successfully');
      })
      .addCase(adminCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Product creation failed');
      })

      // Update Product
      .addCase(adminUpdateProduct.pending, state => {
        state.loading = true;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        // console.log('✅ Updated product payload:', action.payload);
        const updatedProduct = action.payload;
        const index = state.products.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products.products[index] = updatedProduct;
        }
        state.loading = false;
        state.success = true;
        toast.success('Product updated successfully');
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Product update failed');
      })

      // Delete Product
      // .addCase(adminDeleteProduct.pending, state => {
      //   state.loading = true;
      // })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.products.products = state.products.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearAdminProductState, setUpdateProduct, removeProductFromList } =
  adminProductSlice.actions;
export default adminProductSlice.reducer;
