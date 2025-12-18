/**
 * @fileoverview Create Workout Use Case
 * @description Clean Architecture: Use Case layer - Business logic for creating workouts
 * @module useCases/workouts/CreateWorkout
 */

const Workout = require('../../entities/Workout');
const Exercise = require('../../entities/Exercise');
const { BadRequestError, NotFoundError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Create a new workout
 * @param {Object} workoutData - Workout data
 * @param {string} workoutData.title - Workout title
 * @param {string} workoutData.description - Workout description
 * @param {Array<string>} workoutData.exercises - Array of exercise IDs
 * @param {number} workoutData.duration - Duration in minutes
 * @param {number} workoutData.caloriesBurned - Calories burned
 * @param {Date} workoutData.date - Workout date
 * @param {string} userId - User ID creating the workout
 * @returns {Promise<Object>} Created workout object
 * @throws {BadRequestError} If validation fails
 * @throws {NotFoundError} If exercises not found
 */
const createWorkout = async (workoutData, userId) => {
  const { title, description, exercises, duration, caloriesBurned, date } = workoutData;

  try {
    // Validate exercises exist
    if (exercises && exercises.length > 0) {
      const exerciseDocs = await Exercise.find({
        _id: { $in: exercises },
        isActive: true,
      });

      if (exerciseDocs.length !== exercises.length) {
        throw new NotFoundError('One or more exercises not found');
      }
    }

    // Create workout
    const workout = new Workout({
      title,
      description: description || '',
      exercises: exercises || [],
      duration: duration || 0,
      caloriesBurned: caloriesBurned || 0,
      date: date ? new Date(date) : new Date(),
      userId,
      status: 'planned',
    });

    // Save workout
    await workout.save();

    // Populate exercises for response
    await workout.populate('exercises', 'name muscleGroup difficulty');

    logger.info('Workout created successfully', {
      workoutId: workout._id,
      userId,
    });

    return {
      id: workout._id,
      title: workout.title,
      description: workout.description,
      exercises: workout.exercises,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      date: workout.date,
      status: workout.status,
      createdAt: workout.createdAt,
    };
  } catch (err) {
    // Re-throw known errors
    if (err.isOperational) {
      throw err;
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      throw new BadRequestError(errors.join(', '));
    }

    logger.error('Error creating workout:', err);
    throw new BadRequestError('Failed to create workout');
  }
};

module.exports = createWorkout;

