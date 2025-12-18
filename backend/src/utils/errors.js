/**
 * @fileoverview Custom error classes and error handling utilities
 * @description Production-ready error handling with proper HTTP status codes
 * @module utils/errors
 */

const logger = require('./logger');

/**
 * Base Application Error class
 * @extends Error
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether error is operational (expected)
   */
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad Request Error (400)
 * @extends AppError
 */
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

/**
 * Unauthorized Error (401)
 * @extends AppError
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error (403)
 * @extends AppError
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Not Found Error (404)
 * @extends AppError
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error (409)
 * @extends AppError
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Validation Error (422)
 * @extends AppError
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 422);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.id || 'anonymous',
  };

  if (err.statusCode >= 500) {
    logger.error('Server Error:', errorDetails);
  } else {
    logger.warn('Client Error:', errorDetails);
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      // Programming or unknown error
      logger.error('Programming Error:', errorDetails);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

/**
 * Handle async errors in route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function that catches errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Handle 404 errors
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFoundHandler = (req, res, next) => {
  const err = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(err);
};

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler,
};

