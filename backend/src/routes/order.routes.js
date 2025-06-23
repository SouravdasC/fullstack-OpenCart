import { Router } from "express"
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from "../controllers/order.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const orderRouter = Router();

orderRouter.route("/order/new").post(isAuthenticatedUser, newOrder);

orderRouter.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

orderRouter.route("/orders/me").get(isAuthenticatedUser, myOrders);

orderRouter.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

orderRouter.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default orderRouter