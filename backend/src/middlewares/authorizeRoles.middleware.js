import { ErrorHandler } from "../utils/errorHandler.js"

// for user - admin or not
export const authorizeRoles = (...roles) => {

  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next (new ErrorHandler(404, `Role: ${req.user.role} is not allowed to access this resource`))
    }

    next()
  }

}