import { createOrder, getOrdersDetails, myOrders } from '@/redux/thunk/orderThunk/orderThunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  order: {},
  orders: [],
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: bulider => {
    bulider
      // create order
      .addCase(createOrder.pending, state => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // my orders
      .addCase(myOrders.pending, state => {
        state.loading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // order details
      .addCase(getOrdersDetails.pending, state => {
        state.loading = true;
      })
      .addCase(getOrdersDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrdersDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;

export default orderSlice.reducer;
