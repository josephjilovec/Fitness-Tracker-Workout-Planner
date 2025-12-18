/**
 * @fileoverview Get Workout Stats Use Case
 * @description Clean Architecture: Use Case layer - Business logic for workout statistics
 * @module useCases/workouts/GetWorkoutStats
 */

const Workout = require('../../entities/Workout');
const mongoose = require('mongoose');

/**
 * Get aggregated workout statistics for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {Date} options.startDate - Start date for statistics
 * @param {Date} options.endDate - End date for statistics
 * @returns {Promise<Object>} Statistics object
 */
const getWorkoutStats = async (userId, options = {}) => {
  const { startDate, endDate } = options;

  try {
    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
      status: 'completed',
    };

    // Add date range if provided
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Aggregate statistics
    const stats = await Workout.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          workoutCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate totals
    const totals = stats.reduce(
      (acc, stat) => ({
        totalDuration: acc.totalDuration + stat.totalDuration,
        totalCalories: acc.totalCalories + stat.totalCalories,
        totalWorkouts: acc.totalWorkouts + stat.workoutCount,
      }),
      { totalDuration: 0, totalCalories: 0, totalWorkouts: 0 },
    );

    return {
      dailyStats: stats,
      totals,
    };
  } catch (err) {
    throw new Error('Failed to retrieve workout statistics');
  }
};

module.exports = getWorkoutStats;

