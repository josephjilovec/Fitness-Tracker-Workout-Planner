/**
 * @fileoverview API Configuration
 * @description Centralized API configuration and base URL management
 * @module config/api
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const API_CONFIG = {
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;

