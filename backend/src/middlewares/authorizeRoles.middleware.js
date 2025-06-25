import { ErrorHandler } from "../utils/errorHandler.js"

// for user - admin or not
export const authorizeRoles = (...roles) => {

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next (new ErrorHandler(403, `Role: ${req.user.role} is not allowed to access this resource`))
    }

    next()
  }

}