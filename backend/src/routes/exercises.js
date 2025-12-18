/**
 * @fileoverview Exercise Routes
 * @description RESTful API routes for exercise management
 * @module routes/exercises
 */

const express = require('express');
const Exercise = require('../entities/Exercise');
const { validateCreateExercise, validateExerciseSearch, validateMongoId } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler, NotFoundError, BadRequestError } = require('../utils/errors');

const router = express.Router();

// All exercise routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/exercises
 * @desc    Create a new exercise
 * @access  Private
 */
router.post(
  '/',
  validateCreateExercise,
  asyncHandler(async (req, res) => {
    const { name, description, muscleGroup, equipment, difficulty, media, instructions, tips } = req.body;

    // Check if exercise exists
    const existingExercise = await Exercise.findOne({ name });
    if (existingExercise) {
      throw new BadRequestError('Exercise name already exists');
    }

    const exercise = new Exercise({
      name,
      description: description || '',
      muscleGroup: Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup],
      equipment: Array.isArray(equipment) ? equipment : equipment ? [equipment] : [],
      difficulty,
      media: media || {},
      instructions: instructions || [],
      tips: tips || [],
      createdBy: req.user.id,
    });

    await exercise.save();

    res.status(201).json({
      status: 'success',
      message: 'Exercise created successfully',
      data: { exercise },
    });
  }),
);

/**
 * @route   GET /api/exercises
 * @desc    Get all exercises or search exercises
 * @access  Private
 */
router.get(
  '/',
  validateExerciseSearch,
  asyncHandler(async (req, res) => {
    const { muscleGroup, equipment, difficulty, search, page, limit } = req.query;

    const result = await Exercise.search(
      {
        muscleGroup,
        equipment,
        difficulty,
        search,
      },
      { page, limit },
    );

    res.status(200).json({
      status: 'success',
      message: 'Exercises retrieved successfully',
      data: result,
    });
  }),
);

/**
 * @route   GET /api/exercises/:id
 * @desc    Get exercise by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise || !exercise.isActive) {
      throw new NotFoundError('Exercise not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Exercise retrieved successfully',
      data: { exercise },
    });
  }),
);

/**
 * @route   PUT /api/exercises/:id
 * @desc    Update an exercise by ID
 * @access  Private
 */
router.put(
  '/:id',
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    // Update fields
    if (req.body.name !== undefined) exercise.name = req.body.name;
    if (req.body.description !== undefined) exercise.description = req.body.description;
    if (req.body.muscleGroup !== undefined) {
      exercise.muscleGroup = Array.isArray(req.body.muscleGroup)
        ? req.body.muscleGroup
        : [req.body.muscleGroup];
    }
    if (req.body.equipment !== undefined) {
      exercise.equipment = Array.isArray(req.body.equipment) ? req.body.equipment : [req.body.equipment];
    }
    if (req.body.difficulty !== undefined) exercise.difficulty = req.body.difficulty;
    if (req.body.media !== undefined) exercise.media = req.body.media;
    if (req.body.instructions !== undefined) exercise.instructions = req.body.instructions;
    if (req.body.tips !== undefined) exercise.tips = req.body.tips;

    await exercise.save();

    res.status(200).json({
      status: 'success',
      message: 'Exercise updated successfully',
      data: { exercise },
    });
  }),
);

/**
 * @route   DELETE /api/exercises/:id
 * @desc    Delete an exercise by ID (soft delete)
 * @access  Private
 */
router.delete(
  '/:id',
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      throw new NotFoundError('Exercise not found');
    }

    // Soft delete
    exercise.isActive = false;
    await exercise.save();

    res.status(200).json({
      status: 'success',
      message: 'Exercise deleted successfully',
    });
  }),
);

module.exports = router;

