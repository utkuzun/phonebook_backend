const errorHandler = (err, req, res, next) => {
  let customError = {
    message: err.message || 'internal server error',
    statusCode: err.statusCode || 500,
  }

  if (err.name === 'CastError') {
    customError.message = 'id is not in correct type'
    customError.statusCode = 400
  }

  if (err.name === 'ValidationError') {
    customError.statusCode = 400
  }
  res.status(customError.statusCode).json({ error: customError.message })
}


module.exports = errorHandler