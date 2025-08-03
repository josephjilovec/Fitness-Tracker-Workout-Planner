const express = require('express');
const Workout = require('../models/Workout');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/workouts/create
// @desc    Create a new workout
// @access  Private
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, exercises, duration, caloriesBurned } = req.body;

  try {
    // Validate input
    if (!title || !exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: 'Title and exercises array are required' });
    }

    // Create new workout
    const workout = new Workout({
      title,
      description: description || '',
      exercises,
      duration: duration || 0,
      caloriesBurned: caloriesBurned || 0,
      userId: req.user.id
    });

    // Save to MongoDB
    await workout.save();

    res.status(201).json({
      message: 'Workout created successfully',
      workout: {
        id: workout._id,
        title: workout.title,
        description: workout.description,
        exercises: workout.exercises,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        date: workout.date
      }
    });
  } catch (err) {
    console.error('Create workout error:', err.message);
    res.status(500).json({ message: 'Server error during workout creation' });
  }
});

// @route   GET /api/workouts/get
// @desc    Get all workouts for the authenticated user
// @access  Private
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id })
      .populate('exercises', 'name muscleGroup difficulty');
    
    res.status(200).json({
      message: 'Workouts retrieved successfully',
      workouts
    });
  } catch (err) {
    console.error('Get workouts error:', err.message);
    res.status(500).json({ message: 'Server error retrieving workouts' });
  }
});

// @route   PUT /api/workouts/update/:id
// @desc    Update a workout by ID
// @access  Private
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { title, description, exercises, duration, caloriesBurned } = req.body;

  try {
    // Find workout and verify ownership
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this workout' });
    }

    // Update fields
    workout.title = title || workout.title;
    workout.description = description !== undefined ? description : workout.description;
    workout.exercises = exercises || workout.exercises;
    workout.duration = duration !== undefined ? duration : workout.duration;
    workout.caloriesBurned = caloriesBurned !== undefined ? caloriesBurned : workout.caloriesBurned;

    // Save updated workout
    await workout.save();

    res.status(200).json({
      message: 'Workout updated successfully',
      workout: {
        id: workout._id,
        title: workout.title,
        description: workout.description,
        exercises: workout.exercises,
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned,
        date: workout.date
      }
    });
  } catch (err) {
    console.error('Update workout error:', err.message);
    res.status(500).json({ message: 'Server error during workout update' });
  }
});

// @route   DELETE /api/workouts/delete/:id
// @desc    Delete a workout by ID
// @access  Private
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    // Find workout and verify ownership
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this workout' });
    }

    // Delete workout
    await workout.deleteOne();

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error('Delete workout error:', err.message);
    res.status(500).json({ message: 'Server error during workout deletion' });
  }
});

// @route   GET /api/workouts/stats
// @desc    Get aggregate workout stats (duration, calories) by date
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          workoutCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      message: 'Stats retrieved successfully',
      stats
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ message: 'Server error retrieving stats' });
  }
});

module.exports = router;
