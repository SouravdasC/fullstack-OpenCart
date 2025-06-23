class ErrorHandler extends Error{
  constructor(
    statusCode,
    message = "Somthing Went Wrong",
    stack,
    errors = []
  ) {
    super(message)
    this.message = message
    this.statusCode = statusCode
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.stack)
    }
  }
}

export { ErrorHandler }