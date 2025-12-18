/**
 * @fileoverview Main Server Entry Point
 * @description Production-ready Express server with comprehensive middleware and error handling
 * @module server
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config');
const logger = require('./utils/logger');
const { connectDB } = require('./database/connection');
const {
  helmetConfig,
  rateLimiter,
  mongoSanitizeConfig,
  hppConfig,
  xssProtection,
} = require('./middleware/security');
const { globalErrorHandler, notFoundHandler } = require('./utils/errors');

// Import routes
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');
const socialRoutes = require('./routes/social');
const healthRoutes = require('./routes/health');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(xssProtection);
app.use(mongoSanitizeConfig);
app.use(hppConfig);

// CORS configuration
app.use(
  cors({
    origin: config.security.cors.origin,
    credentials: config.security.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// HTTP request logging
if (config.env !== 'test') {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting (applied to all routes except health checks)
app.use(rateLimiter);

// ==================== ROUTES ====================

// Health check routes (no rate limiting)
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// API routes
app.use(`/api/${config.apiVersion}/users`, userRoutes);
app.use(`/api/${config.apiVersion}/workouts`, workoutRoutes);
app.use(`/api/${config.apiVersion}/exercises`, exerciseRoutes);
app.use(`/api/${config.apiVersion}/social`, socialRoutes);

// Legacy route support (without version)
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/social', socialRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Fitness Tracker API',
    version: '2.0.0',
    documentation: '/api/health',
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

// ==================== SERVER STARTUP ====================

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
      logger.info(`API available at http://localhost:${config.port}/api/${config.apiVersion}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        logger.info('HTTP server closed');

        // Close database connection
        require('./database/connection')
          .disconnectDB()
          .then(() => {
            logger.info('Graceful shutdown completed');
            process.exit(0);
          })
          .catch((err) => {
            logger.error('Error during shutdown:', err);
            process.exit(1);
          });
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err);
      gracefulShutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      gracefulShutdown('uncaughtException');
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;

