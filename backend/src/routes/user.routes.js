import { Router } from "express";
import { registerUser, loginUser, logoutUser, forgotPasswordToken, resetPasswword, getUserDetails, updateUserPassword, updateUserProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } from "../controllers/user.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router()

// Auth Routes
userRouter.route("/register").post(upload.single('avatar'), registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").get(logoutUser)

// Password Management
userRouter.route("/password/forgot").post(forgotPasswordToken)
userRouter.route("/password/reset/:token").put(resetPasswword)
userRouter.route("/password/update").put(isAuthenticatedUser, updateUserPassword)

// User Profile
userRouter.route("/me").get(isAuthenticatedUser, getUserDetails)
userRouter.route("/me/update").put(isAuthenticatedUser, upload.single('avatar'),updateUserProfile)

// for admin access
userRouter.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser)
userRouter.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizeRoles("admin"),upload.single('avatar'), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)



export default userRouter