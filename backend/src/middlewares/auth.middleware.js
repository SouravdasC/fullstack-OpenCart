import { User } from "../models/user.model.js";
import { errorAsynHandler } from "../utils/errorAsynHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"

export const isAuthenticatedUser = errorAsynHandler(async (req, res, next) => {
  try {
    const {token} = req.cookies;

    if (!token) {
      throw new ErrorHandler(401, "unauthorized user & please login")
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodedToken.id)

    req.user = user

    next()
    
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})