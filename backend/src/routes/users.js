/**
 * @fileoverview User Routes
 * @description RESTful API routes for user authentication and management
 * @module routes/users
 */

const express = require('express');
const registerUser = require('../useCases/auth/RegisterUser');
const loginUser = require('../useCases/auth/LoginUser');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authRateLimiter } = require('../middleware/security');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authRateLimiter,
  validateRegister,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const result = await registerUser({ username, email, password });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result,
    });
  }),
);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post(
  '/login',
  authRateLimiter,
  validateLogin,
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const result = await loginUser({ username, password });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  }),
);

module.exports = router;

