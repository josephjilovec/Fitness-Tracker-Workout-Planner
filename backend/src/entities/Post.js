/**
 * @fileoverview Post Entity (Domain Model)
 * @description Clean Architecture: Entity layer - Core business logic for Social Posts
 * @module entities/Post
 */

const mongoose = require('mongoose');

/**
 * Post Schema Definition
 * Represents social posts in the fitness community
 */
const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      minlength: [1, 'Post content cannot be empty'],
      maxlength: [1000, 'Post content must be less than 1000 characters'],
      index: 'text',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      default: null,
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
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ isActive: 1, createdAt: -1 });

/**
 * Instance method to toggle like
 * @param {ObjectId} userId - User ID to toggle like
 * @returns {Promise<boolean>} True if liked, false if unliked
 */
PostSchema.methods.toggleLike = function (userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex === -1) {
    this.likes.push(userId);
    return true;
  }
  this.likes.splice(likeIndex, 1);
  return false;
};

/**
 * Instance method to check if user liked the post
 * @param {ObjectId} userId - User ID to check
 * @returns {boolean} True if user liked the post
 */
PostSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((id) => id.toString() === userId.toString());
};

/**
 * Static method to get posts with pagination
 * @param {Object} filters - Filter options
 * @param {Object} options - Query options (page, limit)
 * @returns {Promise<Object>} Posts with pagination info
 */
PostSchema.statics.getPosts = async function (filters = {}, options = {}) {
  const { userId, page = 1, limit = 20 } = { ...filters, ...options };

  const query = { isActive: true };
  if (userId) {
    query.userId = userId;
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    this.find(query)
      .populate('userId', 'username profile.name profile.avatar')
      .populate('workoutId', 'title duration caloriesBurned')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    this.countDocuments(query),
  ]);

  return {
    posts,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

