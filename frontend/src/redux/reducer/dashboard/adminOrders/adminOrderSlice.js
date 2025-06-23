import {
  adminDeleteOrder,
  adminUpdateOrder,
  fetchSingleOrder,
  getAllOrders,
} from '@/redux/thunk/dashboardThunk/adminOrdersThunk/adminOrderThunk';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  orderToEdit: null,
  success: false,
  error: null,
  loading: false,
  singleOrder: null,
  totalAmount: 0,
};

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState,
  reducers: {
    clearAdminOrderState: state => {
      state.error = null;
      state.success = false;
      state.orderToEdit = null;
    },
    setOrderToUpdate: (state, action) => {
      state.orderToEdit = action.payload;
    },
    removeOrderFromList: (state, action) => {
      state.orders.orders = state.orders.orders.filter(order => order._id !== action.payload);
    },
    updateOrderInList: (state, action) => {
      const updatedOrder = action.payload;
      const index = state.orders.orders.findIndex(order => order._id === updatedOrder._id);
      if (index !== -1) {
        state.orders.orders[index] = updatedOrder;
      }
    },
  },
  extraReducers: builder => {
    builder
      // all orders
      .addCase(getAllOrders.pending, state => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })

      // single order details
      .addCase(fetchSingleOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOrder = action.payload;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update orders
      .addCase(adminUpdateOrder.pending, state => {
        state.loading = true;
      })
      .addCase(adminUpdateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.orderToEdit = action.payload;
      })
      .addCase(adminUpdateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(adminDeleteOrder.pending, state => {
        state.loading = true;
      })
      .addCase(adminDeleteOrder.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(adminDeleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminOrderState, setOrderToUpdate, removeOrderFromList, updateOrderInList } =
  adminOrderSlice.actions;
export default adminOrderSlice.reducer;
