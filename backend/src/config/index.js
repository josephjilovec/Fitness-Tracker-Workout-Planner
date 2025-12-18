/**
 * @fileoverview Centralized configuration management
 * @description Loads and validates environment variables with sensible defaults
 * @module config
 */

require('dotenv').config();

/**
 * Application configuration object
 * Validates all required environment variables and provides defaults
 */
const config = {
  // Server Configuration
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',

  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set in production');
      }
      return 'development-secret-change-in-production';
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_REFRESH_SECRET must be set in production');
      }
      return 'development-refresh-secret-change-in-production';
    })(),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    file: process.env.LOG_FILE || 'logs/app.log',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
  },

  // Frontend Configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // AWS Configuration (Optional)
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  // Email Configuration (Optional)
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: process.env.EMAIL_FROM || 'noreply@fitness-tracker.com',
  },

  // Redis Configuration (Optional)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },

  // Monitoring Configuration (Optional)
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY,
  },
};

/**
 * Validates critical configuration values
 * @throws {Error} If required production values are missing
 */
const validateConfig = () => {
  if (config.env === 'production') {
    const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGODB_URI'];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(', ')}`,
      );
    }

    if (config.jwt.secret === 'development-secret-change-in-production') {
      throw new Error('JWT_SECRET must be changed from default in production');
    }
  }
};

// Validate configuration on load
validateConfig();

module.exports = config;

