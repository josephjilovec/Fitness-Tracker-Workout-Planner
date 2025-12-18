/**
 * @fileoverview Delete Workout Use Case
 * @description Clean Architecture: Use Case layer - Business logic for deleting workouts
 * @module useCases/workouts/DeleteWorkout
 */

const Workout = require('../../entities/Workout');
const { NotFoundError, ForbiddenError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Delete a workout
 * @param {string} workoutId - Workout ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<void>}
 * @throws {NotFoundError} If workout not found
 * @throws {ForbiddenError} If user doesn't own the workout
 */
const deleteWorkout = async (workoutId, userId) => {
  try {
    // Find workout
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    // Check ownership
    if (workout.userId.toString() !== userId) {
      throw new ForbiddenError('Unauthorized to delete this workout');
    }

    // Delete workout
    await workout.deleteOne();

    logger.info('Workout deleted successfully', {
      workoutId: workout._id,
      userId,
    });
  } catch (err) {
    // Re-throw known errors
    if (err.isOperational) {
      throw err;
    }

    logger.error('Error deleting workout:', err);
    throw new Error('Failed to delete workout');
  }
};

module.exports = deleteWorkout;

