import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { errorAsynHandler } from "../utils/errorAsynHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";

// create order : /api/v1/order/new
const newOrder = errorAsynHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo, 
    paidAt, 
    itemsPrice, 
    taxPrice, 
    totalPrice, 
    shippingPrice
  } = req.body;

  const order = await Order.create(
    {
      shippingInfo,
      orderItems,
      paymentInfo,
      paidAt,
      itemsPrice,
      taxPrice,
      totalPrice,
      shippingPrice,
      paidAt: Date.now(),
      user: req.user._id
    }
  )

  res.status(201).json({success: true, order})
})

// get single order: /api/v1//order/:id
const getSingleOrder = errorAsynHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(ErrorHandler(404, `odrer not found with id ${req.params.id}`))
  }

  res.status(200).json({success: true, order})
    
})

// get logged in user order: /api/v1//orders/me
const myOrders = errorAsynHandler(async (req, res, _) => {

  const userOrders = await Order.find({user: req.user._id})

  res.status(200).json({success: true, userOrders})
})

// get all orders for admin ---- admin: /api/v1/admin/orders

const getAllOrders = errorAsynHandler(async (req, res, next) => {
  const resultPerPage = 4;
  const currentPage = Number(req.query.page) || 1;

  const totalOrders = await Order.countDocuments();

  const orders = await Order.find()
    .populate('user', 'name email') // optional
    .sort({ createdAt: -1 })
    .skip(resultPerPage * (currentPage - 1))
    .limit(resultPerPage);

  let totalAmount = 0;
  orders.forEach(order => totalAmount += order.totalPrice);

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
    ordersCount: totalOrders,
    resultPerPage,
    currentPage,
  });
});


// update orders status --- admin: /api/v1/admin/order/:id
const updateOrder = errorAsynHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(404, `Order not found with this ID: ${req.params.id}`));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler(400, "This order has already been delivered."));
  }

  // 🔄 Stock actions based on status
  const newStatus = req.body.status;

  if (newStatus === "Shipped" || newStatus === "Delivered") {
    for (const item of order.orderItems) {
      await deductStock(item.product, item.quantity);
    }
  }

  if (newStatus === "Cancelled") {
    for (const item of order.orderItems) {
      await restockItem(item.product, item.quantity);
    }
  }

  // 🟢 Set delivered timestamp
  if (newStatus === "Delivered") {
    order.deliverdAt = Date.now();
  }

  order.orderStatus = newStatus;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Order status updated" });
});


// 📌 Stock Helpers
async function deductStock(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    console.warn(`⚠️ Skipping stock deduction: Product not found: ${id}`);
    return;
  }
  product.stock = Math.max(0, product.stock - quantity);
  await product.save({ validateBeforeSave: false });
}
//restore stcok
async function restockItem(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    console.warn(`⚠️ Skipping restock: Product not found: ${id}`);
    return;
  }
  product.stock += quantity;
  await product.save({ validateBeforeSave: false });
}




// delete order --- admin: /api/v1/admin/order/:id
const deleteOrder = errorAsynHandler(async (req, res, next) => {
   const orderId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new ErrorHandler(400, "Invalid order ID"));
  }

  // Find and delete order
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorHandler(404, `Order not found with this ID: ${orderId}`));
  }

  await order.deleteOne(); // or use Order.findByIdAndDelete(orderId)

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    orderId: orderId,
  });
})

export { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder }