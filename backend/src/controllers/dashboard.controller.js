import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { errorAsynHandler } from "../utils/errorAsynHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";

// admin dashboard: /api/v1/admin/dashboard
export const getAdminDashboardStats = errorAsynHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0)

  const products = await Product.find();
  let outOfStock = 0;

  products.forEach(product => {
    if (product.stock === 0) outOfStock++
  })

  const inStock = totalProducts - outOfStock;

  if (!(totalUsers || totalProducts || totalOrders )) {

    return next(new ErrorHandler(500, "Failed to fetch dashboard data")) 
    }

  res.status(200).json({
    success: true,
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    stock: {
      outOfStock, inStock
    },
     lineChartData: [0, totalRevenue],
  })
})