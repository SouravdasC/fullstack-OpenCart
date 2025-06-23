const errorAsynHandler = (errorRequest) => {
  return (req, res, next) => {
    Promise.resolve(errorRequest(req, res, next)).catch((err) => next(err))
  }
}

export {errorAsynHandler}