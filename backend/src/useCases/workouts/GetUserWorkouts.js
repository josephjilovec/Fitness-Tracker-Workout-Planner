/**
 * @fileoverview Get User Workouts Use Case
 * @description Clean Architecture: Use Case layer - Business logic for retrieving user workouts
 * @module useCases/workouts/GetUserWorkouts
 */

const Workout = require('../../entities/Workout');

/**
 * Get all workouts for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {Date} options.startDate - Start date filter
 * @param {Date} options.endDate - End date filter
 * @param {string} options.status - Status filter
 * @param {number} options.page - Page number
 * @param {number} options.limit - Results per page
 * @returns {Promise<Object>} Workouts with pagination info
 */
const getUserWorkouts = async (userId, options = {}) => {
  const {
    startDate,
    endDate,
    status,
    page = 1,
    limit = 20,
  } = options;

  try {
    const query = { userId };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      Workout.find(query)
        .populate('exercises', 'name muscleGroup difficulty equipment')
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Workout.countDocuments(query),
    ]);

    return {
      workouts,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    throw new Error('Failed to retrieve workouts');
  }
};

module.exports = getUserWorkouts;

