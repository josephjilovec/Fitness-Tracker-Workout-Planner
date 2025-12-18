/**
 * @fileoverview Update Workout Use Case
 * @description Clean Architecture: Use Case layer - Business logic for updating workouts
 * @module useCases/workouts/UpdateWorkout
 */

const Workout = require('../../entities/Workout');
const Exercise = require('../../entities/Exercise');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../../utils/errors');
const logger = require('../../utils/logger');

/**
 * Update a workout
 * @param {string} workoutId - Workout ID
 * @param {Object} updateData - Workout update data
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} Updated workout object
 * @throws {NotFoundError} If workout not found
 * @throws {ForbiddenError} If user doesn't own the workout
 * @throws {BadRequestError} If validation fails
 */
const updateWorkout = async (workoutId, updateData, userId) => {
  try {
    // Find workout
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      throw new NotFoundError('Workout not found');
    }

    // Check ownership
    if (workout.userId.toString() !== userId) {
      throw new ForbiddenError('Unauthorized to update this workout');
    }

    // Validate exercises if provided
    if (updateData.exercises && updateData.exercises.length > 0) {
      const exerciseDocs = await Exercise.find({
        _id: { $in: updateData.exercises },
        isActive: true,
      });

      if (exerciseDocs.length !== updateData.exercises.length) {
        throw new NotFoundError('One or more exercises not found');
      }
    }

    // Update fields
    if (updateData.title !== undefined) workout.title = updateData.title;
    if (updateData.description !== undefined) workout.description = updateData.description;
    if (updateData.exercises !== undefined) workout.exercises = updateData.exercises;
    if (updateData.duration !== undefined) workout.duration = updateData.duration;
    if (updateData.caloriesBurned !== undefined) workout.caloriesBurned = updateData.caloriesBurned;
    if (updateData.date !== undefined) workout.date = new Date(updateData.date);
    if (updateData.status !== undefined) workout.status = updateData.status;
    if (updateData.notes !== undefined) workout.notes = updateData.notes;

    // Save updated workout
    await workout.save();

    // Populate exercises for response
    await workout.populate('exercises', 'name muscleGroup difficulty');

    logger.info('Workout updated successfully', {
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
      notes: workout.notes,
      updatedAt: workout.updatedAt,
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

    logger.error('Error updating workout:', err);
    throw new BadRequestError('Failed to update workout');
  }
};

module.exports = updateWorkout;

