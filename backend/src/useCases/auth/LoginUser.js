/**
 * @fileoverview Login User Use Case
 * @description Clean Architecture: Use Case layer - Business logic for user authentication
 * @module useCases/auth/LoginUser
 */

const User = require('../../entities/User');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { UnauthorizedError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Authenticate user and generate JWT token
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} User object with JWT token
 * @throws {UnauthorizedError} If credentials are invalid
 */
const loginUser = async (credentials) => {
  const { username, password } = credentials;

  try {
    // Find user by username or email
    const user = await User.findByEmailOrUsername(username).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await user.updateLastLogin();

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

    logger.info('User logged in successfully', {
      userId: user._id,
      username: user.username,
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        lastLogin: user.lastLogin,
      },
      token,
    };
  } catch (err) {
    // Re-throw known errors
    if (err.isOperational) {
      throw err;
    }

    logger.error('Error logging in user:', err);
    throw new UnauthorizedError('Failed to authenticate user');
  }
};

module.exports = loginUser;

