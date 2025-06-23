import { configureStore } from '@reduxjs/toolkit';
import productReducer from './reducer/productSlice';
import userReducer from './reducer/userSlice';
import profileUpdateReducer from './reducer/profileUpdateSlice';
import passwordManagementReducer from './reducer/passwordReducer/passwordSlice';
import cartItemsReducer from './reducer/cartReducer/cartItemsSlice';
import userOrderReducer from './reducer/order/orderslice';
import productReview from './reducer/reviewReducer/reviewSlice';
import adminProductList from './reducer/dashboard/adminProducts/adminProductsListSlice';
import dashboard from './reducer/dashboard/adminDashboard/adminDashboardSlice';
import adminOrderList from './reducer/dashboard/adminOrders/adminOrderSlice';
import adminAllUsers from './reducer/dashboard/adminUsers/adminUserSlice';
import adminAllReviews from './reducer/dashboard/adminReview/adminReviewSlice';
import contact from './reducer/contactSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    profileUpdate: profileUpdateReducer,
    password: passwordManagementReducer,
    cart: cartItemsReducer,
    order: userOrderReducer,
    review: productReview,

    // for adminProduct
    adminDashboard: dashboard,
    adminProduct: adminProductList,
    adminOrder: adminOrderList,
    adminUsers: adminAllUsers,
    adminReviews: adminAllReviews,
    contact,
  },
});
