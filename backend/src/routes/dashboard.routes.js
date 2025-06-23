import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { getAdminDashboardStats } from "../controllers/dashboard.controller.js";


const dashboradRouter = Router();

dashboradRouter.route('/admin/dashboard').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminDashboardStats)


export default dashboradRouter