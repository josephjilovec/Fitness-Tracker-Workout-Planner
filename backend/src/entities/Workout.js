/**
 * @fileoverview Workout Entity (Domain Model)
 * @description Clean Architecture: Entity layer - Core business logic for Workout
 * @module entities/Workout
 */

const mongoose = require('mongoose');

/**
 * Workout Schema Definition
 * Represents the core Workout entity with business rules
 */
const WorkoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Workout title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title must be less than 100 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be less than 500 characters'],
      default: '',
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
      max: [1440, 'Duration cannot exceed 24 hours (1440 minutes)'],
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned cannot be negative'],
      max: [10000, 'Calories burned seems unrealistic'],
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'cancelled'],
      default: 'planned',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes must be less than 1000 characters'],
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound indexes for performance
WorkoutSchema.index({ userId: 1, date: -1 });
WorkoutSchema.index({ userId: 1, createdAt: -1 });
WorkoutSchema.index({ date: -1 });
WorkoutSchema.index({ status: 1 });

/**
 * Instance method to calculate total estimated calories
 * @returns {number} Total estimated calories
 */
WorkoutSchema.methods.calculateEstimatedCalories = function () {
  // Simple estimation: 10 calories per minute of exercise
  return Math.round(this.duration * 10);
};

/**
 * Instance method to check if workout is overdue
 * @returns {boolean} True if workout date is in the past and status is planned
 */
WorkoutSchema.methods.isOverdue = function () {
  return this.status === 'planned' && this.date < new Date();
};

/**
 * Static method to get user's workout statistics
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Promise<Object>} Statistics object
 */
WorkoutSchema.statics.getUserStats = async function (userId, startDate, endDate) {
  const matchStage = {
    userId: new mongoose.Types.ObjectId(userId),
    status: 'completed',
  };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = startDate;
    if (endDate) matchStage.date.$lte = endDate;
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        totalCalories: { $sum: '$caloriesBurned' },
        avgDuration: { $avg: '$duration' },
        avgCalories: { $avg: '$caloriesBurned' },
      },
    },
  ]);

  return stats[0] || {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    avgDuration: 0,
    avgCalories: 0,
  };
};

/**
 * Static method to get workouts by date range
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of workout documents
 */
WorkoutSchema.statics.getByDateRange = function (userId, startDate, endDate) {
  const query = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  return this.find(query).populate('exercises', 'name muscleGroup difficulty').sort({ date: -1 });
};

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;

