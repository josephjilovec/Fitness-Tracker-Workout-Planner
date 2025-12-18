/**
 * @fileoverview Challenge Entity (Domain Model)
 * @description Clean Architecture: Entity layer - Core business logic for Challenges
 * @module entities/Challenge
 */

const mongoose = require('mongoose');

/**
 * Challenge Schema Definition
 * Represents fitness challenges that users can join
 */
const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title must be less than 100 characters'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be less than 1000 characters'],
      default: '',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (endDate) {
          return endDate > this.startDate;
        },
        message: 'End date must be after start date',
      },
      index: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
ChallengeSchema.index({ status: 1, startDate: -1 });
ChallengeSchema.index({ isActive: 1, createdAt: -1 });
ChallengeSchema.index({ createdBy: 1, createdAt: -1 });

/**
 * Instance method to add participant
 * @param {ObjectId} userId - User ID to add
 * @returns {Promise<boolean>} True if added, false if already participant
 */
ChallengeSchema.methods.addParticipant = function (userId) {
  if (this.participants.includes(userId)) {
    return false;
  }
  this.participants.push(userId);
  return true;
};

/**
 * Instance method to remove participant
 * @param {ObjectId} userId - User ID to remove
 * @returns {Promise<boolean>} True if removed, false if not participant
 */
ChallengeSchema.methods.removeParticipant = function (userId) {
  const index = this.participants.indexOf(userId);
  if (index === -1) {
    return false;
  }
  this.participants.splice(index, 1);
  return true;
};

/**
 * Instance method to check if user is participant
 * @param {ObjectId} userId - User ID to check
 * @returns {boolean} True if user is participant
 */
ChallengeSchema.methods.isParticipant = function (userId) {
  return this.participants.some((id) => id.toString() === userId.toString());
};

/**
 * Static method to get active challenges
 * @param {Object} options - Query options (page, limit)
 * @returns {Promise<Object>} Challenges with pagination info
 */
ChallengeSchema.statics.getActiveChallenges = async function (options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const query = {
    isActive: true,
    status: { $in: ['upcoming', 'active'] },
  };

  const [challenges, total] = await Promise.all([
    this.find(query)
      .populate('createdBy', 'username profile.name profile.avatar')
      .populate('participants', 'username profile.name')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    this.countDocuments(query),
  ]);

  return {
    challenges,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const Challenge = mongoose.model('Challenge', ChallengeSchema);

module.exports = Challenge;

