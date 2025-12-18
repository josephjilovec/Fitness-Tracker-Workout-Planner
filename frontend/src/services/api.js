/**
 * @fileoverview API Service Layer
 * @description Centralized API service with interceptors and error handling
 * @module services/api
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api';

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

/**
 * Request interceptor - Add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Return error message from server or default
      const message = data?.message || data?.error || 'An error occurred';
      return Promise.reject({ message, status, data });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    } else {
      // Error setting up request
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      });
    }
  },
);

/**
 * API Service Methods
 */
export const apiService = {
  // Auth
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),

  // Workouts
  getWorkouts: (params) => api.get('/workouts', { params }),
  createWorkout: (workoutData) => api.post('/workouts', workoutData),
  updateWorkout: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  getWorkoutStats: (params) => api.get('/workouts/stats', { params }),

  // Exercises
  getExercises: (params) => api.get('/exercises', { params }),
  getExercise: (id) => api.get(`/exercises/${id}`),
  createExercise: (exerciseData) => api.post('/exercises', exerciseData),
  updateExercise: (id, exerciseData) => api.put(`/exercises/${id}`, exerciseData),
  deleteExercise: (id) => api.delete(`/exercises/${id}`),

  // Social
  getPosts: (params) => api.get('/social/posts', { params }),
  createPost: (postData) => api.post('/social/posts', postData),
  likePost: (id) => api.post(`/social/posts/${id}/like`),
  getComments: (params) => api.get('/social/comments', { params }),
  createComment: (commentData) => api.post('/social/comments', commentData),
  getChallenges: (params) => api.get('/social/challenges', { params }),
  createChallenge: (challengeData) => api.post('/social/challenges', challengeData),
  joinChallenge: (id) => api.post(`/social/challenges/${id}/join`),

  // Health
  healthCheck: () => api.get('/health'),
};

export default api;

