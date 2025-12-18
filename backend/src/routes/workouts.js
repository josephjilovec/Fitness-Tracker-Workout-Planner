/**
 * @fileoverview Workout Routes
 * @description RESTful API routes for workout management
 * @module routes/workouts
 */

const express = require('express');
const createWorkout = require('../useCases/workouts/CreateWorkout');
const getUserWorkouts = require('../useCases/workouts/GetUserWorkouts');
const updateWorkout = require('../useCases/workouts/UpdateWorkout');
const deleteWorkout = require('../useCases/workouts/DeleteWorkout');
const getWorkoutStats = require('../useCases/workouts/GetWorkoutStats');
const { validateCreateWorkout, validateUpdateWorkout, validateMongoId } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// All workout routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/workouts
 * @desc    Create a new workout
 * @access  Private
 */
router.post(
  '/',
  validateCreateWorkout,
  asyncHandler(async (req, res) => {
    const workout = await createWorkout(req.body, req.user.id);

    res.status(201).json({
      status: 'success',
      message: 'Workout created successfully',
      data: { workout },
    });
  }),
);

/**
 * @route   GET /api/workouts
 * @desc    Get all workouts for the authenticated user
 * @access  Private
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { startDate, endDate, status, page, limit } = req.query;

    const result = await getUserWorkouts(req.user.id, {
      startDate,
      endDate,
      status,
      page,
      limit,
    });

    res.status(200).json({
      status: 'success',
      message: 'Workouts retrieved successfully',
      data: result,
    });
  }),
);

/**
 * @route   GET /api/workouts/stats
 * @desc    Get aggregate workout stats
 * @access  Private
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const stats = await getWorkoutStats(req.user.id, {
      startDate,
      endDate,
    });

    res.status(200).json({
      status: 'success',
      message: 'Stats retrieved successfully',
      data: stats,
    });
  }),
);

/**
 * @route   PUT /api/workouts/:id
 * @desc    Update a workout by ID
 * @access  Private
 */
router.put(
  '/:id',
  validateMongoId('id'),
  validateUpdateWorkout,
  asyncHandler(async (req, res) => {
    const workout = await updateWorkout(req.params.id, req.body, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Workout updated successfully',
      data: { workout },
    });
  }),
);

/**
 * @route   DELETE /api/workouts/:id
 * @desc    Delete a workout by ID
 * @access  Private
 */
router.delete(
  '/:id',
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    await deleteWorkout(req.params.id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Workout deleted successfully',
    });
  }),
);

module.exports = router;

