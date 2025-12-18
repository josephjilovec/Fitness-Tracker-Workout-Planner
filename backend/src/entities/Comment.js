/**
 * @fileoverview Comment Entity (Domain Model)
 * @description Clean Architecture: Entity layer - Core business logic for Comments
 * @module entities/Comment
 */

const mongoose = require('mongoose');

/**
 * Comment Schema Definition
 * Represents comments on social posts
 */
const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment content cannot be empty'],
      maxlength: [500, 'Comment content must be less than 500 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required'],
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
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });

/**
 * Static method to get comments for a post
 * @param {ObjectId} postId - Post ID
 * @param {Object} options - Query options (page, limit)
 * @returns {Promise<Array>} Array of comment documents
 */
CommentSchema.statics.getByPostId = function (postId, options = {}) {
  const { page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;

  return this.find({ postId, isActive: true })
    .populate('userId', 'username profile.name profile.avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();
};

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

