import { User } from "../models/user.model.js";
import { errorAsynHandler } from "../utils/errorAsynHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"

export const isAuthenticatedUser = errorAsynHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler(401, "Unauthorized access. Please login."));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return next(new ErrorHandler(401, "User no longer exists."));
  }

  req.user = user;
  next();
})