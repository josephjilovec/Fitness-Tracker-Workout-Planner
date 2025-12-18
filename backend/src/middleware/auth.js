/**
 * @fileoverview JWT Authentication middleware
 * @description Production-ready authentication with proper error handling
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * JWT Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      throw new UnauthorizedError('No token provided, authorization denied');
    }

    // Check for Bearer token format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid token format. Use: Bearer <token>');
    }

    const token = parts[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      } else {
        throw new UnauthorizedError('Token verification failed');
      }
    }

    // Attach user ID to request object
    req.user = {
      id: decoded.userId,
      ...(decoded.username && { username: decoded.username }),
      ...(decoded.email && { email: decoded.email }),
    };

    next();
  } catch (err) {
    // Log authentication failures for security monitoring
    logger.warn('Authentication failed', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      error: err.message,
    });

    next(err);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't fail if missing
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        try {
          const decoded = jwt.verify(token, config.jwt.secret);
          req.user = {
            id: decoded.userId,
            ...(decoded.username && { username: decoded.username }),
            ...(decoded.email && { email: decoded.email }),
          };
        } catch (err) {
          // Silently fail for optional auth
        }
      }
    }

    next();
  } catch (err) {
    // Silently fail for optional auth
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
};

