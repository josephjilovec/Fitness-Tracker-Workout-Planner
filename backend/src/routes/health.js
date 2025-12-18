/**
 * @fileoverview Health Check Routes
 * @description Health check and monitoring endpoints
 * @module routes/health
 */

const express = require('express');
const { getConnectionStatus } = require('../database/connection');
const config = require('../config');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = getConnectionStatus();

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    database: {
      status: dbStatus.status,
      host: dbStatus.host,
      name: dbStatus.name,
    },
    version: '2.0.0',
  };

  // If database is not connected, return 503
  if (dbStatus.readyState !== 1) {
    health.status = 'degraded';
    health.database.status = 'disconnected';
    return res.status(503).json(health);
  }

  res.status(200).json(health);
});

/**
 * @route   GET /api/health/ready
 * @desc    Readiness probe (for Kubernetes)
 * @access  Public
 */
router.get('/ready', (req, res) => {
  const dbStatus = getConnectionStatus();

  if (dbStatus.readyState === 1) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready', database: dbStatus.status });
  }
});

/**
 * @route   GET /api/health/live
 * @desc    Liveness probe (for Kubernetes)
 * @access  Public
 */
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;

