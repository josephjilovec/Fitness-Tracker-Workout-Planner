const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Post Schema
const PostSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', CommentSchema);

// Challenge Schema
const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
const Challenge = mongoose.model('Challenge', ChallengeSchema);

// @route   POST /api/social/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', authMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = new Post({
      content,
      userId: req.user.id
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        content: post.content,
        userId: post.userId,
        likes: post.likes,
        createdAt: post.createdAt
      }
    });
  } catch (err) {
    console.error('Create post error:', err.message);
    res.status(500).json({ message: 'Server error during post creation' });
  }
});

// @route   GET /api/social/posts
// @desc    Get all posts
// @access  Private
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Posts retrieved successfully',
      posts
    });
  } catch (err) {
    console.error('Get posts error:', err.message);
    res.status(500).json({ message: 'Server error retrieving posts' });
  }
});

// @route   POST /api/social/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/comments', authMiddleware, async (req, res) => {
  const { postId, content } = req.body;

  try {
    if (!postId || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      userId: req.user.id,
      postId
    });

    await comment.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: comment._id,
        content: comment.content,
        userId: comment.userId,
        postId: comment.postId,
        createdAt: comment.createdAt
      }
    });
  } catch (err) {
    console.error('Add comment error:', err.message);
    res.status(500).json({ message: 'Server error during comment creation' });
  }
});

// @route   GET /api/social/comments
// @desc    Get comments for a post
// @access  Private
router.get('/comments', authMiddleware, async (req, res) => {
  const { postId } = req.query;

  try {
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const comments = await Comment.find({ postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Comments retrieved successfully',
      comments
    });
  } catch (err) {
    console.error('Get comments error:', err.message);
    res.status(500).json({ message: 'Server error retrieving comments' });
  }
});

// @route   POST /api/social/likes
// @desc    Toggle like on a post
// @access  Private
router.post('/likes', authMiddleware, async (req, res) => {
  const { postId } = req.body;

  try {
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({
      message: `Post ${likeIndex === -1 ? 'liked' : 'unliked'} successfully`,
      likes: post.likes
    });
  } catch (err) {
    console.error('Toggle like error:', err.message);
    res.status(500).json({ message: 'Server error during like toggle' });
  }
});

// @route   POST /api/social/challenges
// @desc    Join a challenge
// @access  Private
router.post('/challenges', authMiddleware, async (req, res) => {
  const { challengeId } = req.body;

  try {
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const userId = req.user.id;
    if (challenge.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already joined this challenge' });
    }

    challenge.participants.push(userId);
    await challenge.save();

    res.status(200).json({
      message: 'Joined challenge successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        participants: challenge.participants
      }
    });
  } catch (err) {
    console.error('Join challenge error:', err.message);
    res.status(500).json({ message: 'Server error during challenge join' });
  }
});

// @route   GET /api/social/challenges
// @desc    Get all challenges
// @access  Private
router.get('/challenges', authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Challenges retrieved successfully',
      challenges
    });
  } catch (err) {
    console.error('Get challenges error:', err.message);
    res.status(500).json({ message: 'Server error retrieving challenges' });
  }
});

module.exports = router;
