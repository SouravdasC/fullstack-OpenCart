import { addItemsToCart } from '@/redux/thunk/cartThunk/cartThunk';
import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {},
  loading: false,
  error: null,
  totalPrice: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
};

const cartItemsSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeItemsFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item?.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      toast.success('Item removed from cart');
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
      toast.success('Shipping info saved');
    },
    clearCartError: state => {
      state.error = null;
    },

    clearCart: state => {
      state.cartItems = [];
      state.totalPrice = 0;
      toast.success('Cart cleared');
      localStorage.removeItem('cartItems');
    },
    // total price
    calculateTotalPrice: state => {
      const subtotal = state.cartItems.reduce(
        (acc, item) => acc + (item?.price * item?.quantity || 0),
        0
      );

      const taxRate = 0.18;
      const shippingCharge = subtotal > 500 ? 0 : 50;
      const tax = subtotal * taxRate;
      const totalBeforeDiscount = subtotal + tax + shippingCharge;

      // all total
      state.subtotal = Number(subtotal.toFixed(2));
      state.tax = Number(tax.toFixed(2));
      state.shipping = Number(shippingCharge.toFixed(2));
      state.totalPrice = Number(totalBeforeDiscount.toFixed(2));
    },
    // quantity increase & decrease
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const index = state.cartItems.findIndex(i => i.product === productId);
      if (index !== -1) {
        state.cartItems[index].quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
  },
  extraReducers: bulider => {
    bulider
      // added to cart
      .addCase(addItemsToCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        state.loading = false;

        const item = action.payload;

        const isItemsIndexExist = state.cartItems.findIndex(i => i.product === item?.product);

        if (isItemsIndexExist !== -1) {
          state.cartItems[isItemsIndexExist] = item;
        } else {
          state.cartItems.push(item);
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        toast.success('Item added to cart');
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const {
  removeItemsFromCart,
  saveShippingInfo,
  clearCartError,
  clearCart,
  calculateTotalPrice,
  updateCartQuantity,
} = cartItemsSlice.actions;
export default cartItemsSlice.reducer;
