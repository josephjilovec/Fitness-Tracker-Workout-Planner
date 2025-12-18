/**
 * @fileoverview MongoDB database connection
 * @description Production-ready database connection with retry logic and graceful shutdown
 * @module database/connection
 */

const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * MongoDB connection options
 */
const connectionOptions = {
  ...config.mongodb.options,
  retryWrites: true,
  w: 'majority',
};

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, connectionOptions);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected successfully');
  } catch (err) {
    logger.error('Error disconnecting from MongoDB:', err);
    throw err;
  }
};

/**
 * Get database connection status
 * @returns {Object} Connection status
 */
const getConnectionStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    status: states[state] || 'unknown',
    readyState: state,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
};

