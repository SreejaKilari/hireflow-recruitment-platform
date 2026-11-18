const ApiError = require('../utils/apiError');

// 404 Route Not Found Handler
const notFoundHandler = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

// Centralized Global Error Handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid resource ID: ${err.value}`;
    error = new ApiError(message, 400);
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new ApiError(message, 409);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((val) => val.message);
    const message = `Validation error: ${errors.join(', ')}`;
    error = new ApiError(message, 400, errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token. Authorization denied.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Token has expired. Please log in again.', 401);
  }

  // Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError('File too large. Maximum allowed size is 5MB.', 400);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    statusCode,
    message: error.message || 'Internal Server Error',
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
