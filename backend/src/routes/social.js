/**
 * @fileoverview Social Routes
 * @description RESTful API routes for social features (posts, comments, likes, challenges)
 * @module routes/social
 */

const express = require('express');
const Post = require('../entities/Post');
const Comment = require('../entities/Comment');
const Challenge = require('../entities/Challenge');
const { validateCreatePost, validateCreateComment, validateMongoId } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler, NotFoundError, BadRequestError, ConflictError } = require('../utils/errors');

const router = express.Router();

// All social routes require authentication
router.use(authMiddleware);

// ==================== POSTS ====================

/**
 * @route   POST /api/social/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post(
  '/posts',
  validateCreatePost,
  asyncHandler(async (req, res) => {
    const { content, workoutId } = req.body;

    const post = new Post({
      content,
      userId: req.user.id,
      workoutId: workoutId || null,
    });

    await post.save();
    await post.populate('userId', 'username profile.name profile.avatar');

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: { post },
    });
  }),
);

/**
 * @route   GET /api/social/posts
 * @desc    Get all posts
 * @access  Private
 */
router.get(
  '/posts',
  asyncHandler(async (req, res) => {
    const { userId, page, limit } = req.query;

    const result = await Post.getPosts({ userId }, { page, limit });

    res.status(200).json({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: result,
    });
  }),
);

/**
 * @route   POST /api/social/posts/:id/like
 * @desc    Toggle like on a post
 * @access  Private
 */
router.post(
  '/posts/:id/like',
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive) {
      throw new NotFoundError('Post not found');
    }

    const wasLiked = post.toggleLike(req.user.id);
    await post.save();

    res.status(200).json({
      status: 'success',
      message: `Post ${wasLiked ? 'liked' : 'unliked'} successfully`,
      data: {
        liked: wasLiked,
        likesCount: post.likes.length,
      },
    });
  }),
);

// ==================== COMMENTS ====================

/**
 * @route   POST /api/social/comments
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post(
  '/comments',
  validateCreateComment,
  asyncHandler(async (req, res) => {
    const { postId, content } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post || !post.isActive) {
      throw new NotFoundError('Post not found');
    }

    const comment = new Comment({
      content,
      userId: req.user.id,
      postId,
    });

    await comment.save();
    await comment.populate('userId', 'username profile.name profile.avatar');

    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: { comment },
    });
  }),
);

/**
 * @route   GET /api/social/comments
 * @desc    Get comments for a post
 * @access  Private
 */
router.get(
  '/comments',
  asyncHandler(async (req, res) => {
    const { postId, page, limit } = req.query;

    if (!postId) {
      throw new BadRequestError('Post ID is required');
    }

    const comments = await Comment.getByPostId(postId, { page, limit });

    res.status(200).json({
      status: 'success',
      message: 'Comments retrieved successfully',
      data: { comments },
    });
  }),
);

// ==================== CHALLENGES ====================

/**
 * @route   POST /api/social/challenges
 * @desc    Create a new challenge
 * @access  Private
 */
router.post(
  '/challenges',
  asyncHandler(async (req, res) => {
    const { title, description, endDate } = req.body;

    if (!title || !endDate) {
      throw new BadRequestError('Title and end date are required');
    }

    const challenge = new Challenge({
      title,
      description: description || '',
      createdBy: req.user.id,
      startDate: new Date(),
      endDate: new Date(endDate),
      status: 'upcoming',
    });

    await challenge.save();
    await challenge.populate('createdBy', 'username profile.name profile.avatar');

    res.status(201).json({
      status: 'success',
      message: 'Challenge created successfully',
      data: { challenge },
    });
  }),
);

/**
 * @route   GET /api/social/challenges
 * @desc    Get all active challenges
 * @access  Private
 */
router.get(
  '/challenges',
  asyncHandler(async (req, res) => {
    const { page, limit } = req.query;

    const result = await Challenge.getActiveChallenges({ page, limit });

    res.status(200).json({
      status: 'success',
      message: 'Challenges retrieved successfully',
      data: result,
    });
  }),
);

/**
 * @route   POST /api/social/challenges/:id/join
 * @desc    Join a challenge
 * @access  Private
 */
router.post(
  '/challenges/:id/join',
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge || !challenge.isActive) {
      throw new NotFoundError('Challenge not found');
    }

    if (challenge.isParticipant(req.user.id)) {
      throw new ConflictError('User already joined this challenge');
    }

    challenge.addParticipant(req.user.id);
    await challenge.save();

    res.status(200).json({
      status: 'success',
      message: 'Joined challenge successfully',
      data: { challenge },
    });
  }),
);

module.exports = router;

