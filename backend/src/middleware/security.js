/**
 * @fileoverview Security middleware configuration
 * @description Production-ready security headers, rate limiting, and input sanitization
 * @module middleware/security
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const config = require('../config');

/**
 * Helmet security headers configuration
 * Sets various HTTP headers to help protect the app from well-known web vulnerabilities
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiting middleware
 * Prevents abuse by limiting the number of requests from a single IP
 */
const rateLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
});

/**
 * Stricter rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * MongoDB injection protection
 * Removes any keys that start with "$" or contain "."
 */
const mongoSanitizeConfig = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    // Log potential injection attempts
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to log this to a security monitoring system
      console.warn(`Potential MongoDB injection attempt: ${key}`);
    }
  },
});

/**
 * HTTP Parameter Pollution protection
 * Prevents parameter pollution attacks
 */
const hppConfig = hpp({
  whitelist: [
    'duration',
    'caloriesBurned',
    'age',
    'page',
    'limit',
    'sort',
  ],
});

/**
 * XSS protection
 * Cleans user input from malicious HTML/JavaScript
 */
const xssProtection = xss();

module.exports = {
  helmetConfig,
  rateLimiter,
  authRateLimiter,
  mongoSanitizeConfig,
  hppConfig,
  xssProtection,
};

