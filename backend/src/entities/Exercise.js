/**
 * @fileoverview Exercise Entity (Domain Model)
 * @description Clean Architecture: Entity layer - Core business logic for Exercise
 * @module entities/Exercise
 */

const mongoose = require('mongoose');

/**
 * Valid muscle groups
 */
const MUSCLE_GROUPS = ['Chest', 'Back', 'Arms', 'Shoulders', 'Legs', 'Core', 'Full Body'];

/**
 * Valid equipment types
 */
const EQUIPMENT_TYPES = ['None', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Band', 'Machine', 'Bodyweight'];

/**
 * Valid difficulty levels
 */
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

/**
 * Exercise Schema Definition
 * Represents the core Exercise entity with business rules
 */
const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Exercise name must be at least 3 characters long'],
      maxlength: [100, 'Exercise name must be less than 100 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be less than 500 characters'],
      default: '',
    },
    muscleGroup: {
      type: [String],
      required: [true, 'At least one muscle group is required'],
      validate: {
        validator: (groups) => {
          if (!Array.isArray(groups) || groups.length === 0) return false;
          return groups.every((group) => MUSCLE_GROUPS.includes(group));
        },
        message: `Muscle group must be one of: ${MUSCLE_GROUPS.join(', ')}`,
      },
      index: true,
    },
    equipment: {
      type: [String],
      default: [],
      validate: {
        validator: (equipment) => {
          if (!Array.isArray(equipment)) return false;
          if (equipment.length === 0) return true;
          return equipment.every((item) => EQUIPMENT_TYPES.includes(item));
        },
        message: `Equipment must be one of: ${EQUIPMENT_TYPES.join(', ')}`,
      },
      index: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: DIFFICULTY_LEVELS,
        message: `Difficulty must be one of: ${DIFFICULTY_LEVELS.join(', ')}`,
      },
      index: true,
    },
    media: {
      imageUrl: {
        type: String,
        trim: true,
        validate: {
          validator: (url) => {
            if (!url) return true; // Optional field
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          },
          message: 'Image URL must be a valid HTTP(S) URL ending with an image extension',
        },
        default: '',
      },
      videoUrl: {
        type: String,
        trim: true,
        validate: {
          validator: (url) => {
            if (!url) return true; // Optional field
            return /^https?:\/\/.+\.(mp4|webm|ogg|youtube\.com|youtu\.be)/i.test(url);
          },
          message: 'Video URL must be a valid HTTP(S) URL or YouTube link',
        },
        default: '',
      },
    },
    instructions: {
      type: [String],
      default: [],
      validate: {
        validator: (instructions) => instructions.length <= 20,
        message: 'Cannot have more than 20 instruction steps',
      },
    },
    tips: {
      type: [String],
      default: [],
      validate: {
        validator: (tips) => tips.length <= 10,
        message: 'Cannot have more than 10 tips',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

// Indexes for performance
ExerciseSchema.index({ name: 'text', description: 'text' }); // Text search
ExerciseSchema.index({ muscleGroup: 1, difficulty: 1 });
ExerciseSchema.index({ equipment: 1 });
ExerciseSchema.index({ isActive: 1, createdAt: -1 });

/**
 * Static method to search exercises
 * @param {Object} filters - Search filters
 * @param {Object} options - Query options (page, limit, sort)
 * @returns {Promise<Object>} Search results with pagination
 */
ExerciseSchema.statics.search = async function (filters = {}, options = {}) {
  const {
    muscleGroup,
    equipment,
    difficulty,
    search,
    page = 1,
    limit = 20,
    sort = '-createdAt',
  } = { ...filters, ...options };

  const query = { isActive: true };

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Muscle group filter
  if (muscleGroup) {
    const groups = Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup];
    query.muscleGroup = { $in: groups };
  }

  // Equipment filter
  if (equipment) {
    const equipmentList = Array.isArray(equipment) ? equipment : [equipment];
    query.equipment = { $in: equipmentList };
  }

  // Difficulty filter
  if (difficulty) {
    query.difficulty = difficulty;
  }

  const skip = (page - 1) * limit;

  const [exercises, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    this.countDocuments(query),
  ]);

  return {
    exercises,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Static method to get exercises by muscle group
 * @param {string|Array<string>} muscleGroups - Muscle group(s)
 * @returns {Promise<Array>} Array of exercise documents
 */
ExerciseSchema.statics.getByMuscleGroup = function (muscleGroups) {
  const groups = Array.isArray(muscleGroups) ? muscleGroups : [muscleGroups];
  return this.find({ muscleGroup: { $in: groups }, isActive: true });
};

/**
 * Static method to get exercises by difficulty
 * @param {string} difficulty - Difficulty level
 * @returns {Promise<Array>} Array of exercise documents
 */
ExerciseSchema.statics.getByDifficulty = function (difficulty) {
  return this.find({ difficulty, isActive: true });
};

// Export constants for use in other modules
ExerciseSchema.statics.MUSCLE_GROUPS = MUSCLE_GROUPS;
ExerciseSchema.statics.EQUIPMENT_TYPES = EQUIPMENT_TYPES;
ExerciseSchema.statics.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;

