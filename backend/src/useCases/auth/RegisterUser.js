/**
 * @fileoverview Register User Use Case
 * @description Clean Architecture: Use Case layer - Business logic for user registration
 * @module useCases/auth/RegisterUser
 */

const User = require('../../entities/User');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { ConflictError, BadRequestError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} User object with JWT token
 * @throws {ConflictError} If username or email already exists
 * @throws {BadRequestError} If validation fails
 */
const registerUser = async (userData) => {
  const { username, email, password } = userData;

  try {
    // Check if username exists
    const usernameExists = await User.usernameExists(username);
    if (usernameExists) {
      throw new ConflictError('Username already exists');
    }

    // Check if email exists
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      throw new ConflictError('Email already exists');
    }

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
    });

    // Save user (password will be hashed by pre-save hook)
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    logger.info('User registered successfully', {
      userId: user._id,
      username: user.username,
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
      },
      token,
    };
  } catch (err) {
    // Re-throw known errors
    if (err.isOperational) {
      throw err;
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      throw new ConflictError(`${field} already exists`);
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      throw new BadRequestError(errors.join(', '));
    }

    logger.error('Error registering user:', err);
    throw new BadRequestError('Failed to register user');
  }
};

module.exports = registerUser;

