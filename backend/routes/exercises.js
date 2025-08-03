const express = require('express');
const Exercise = require('../models/Exercise');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/exercises/create
// @desc    Create a new exercise
// @access  Private
router.post('/create', authMiddleware, async (req, res) => {
  const { name, description, muscleGroup, equipment, difficulty, media } = req.body;

  try {
    // Validate input
    if (!name || !muscleGroup || !difficulty) {
      return res.status(400).json({ message: 'Name, muscle group, and difficulty are required' });
    }

    // Check if exercise exists
    const existingExercise = await Exercise.findOne({ name });
    if (existingExercise) {
      return res.status(400).json({ message: 'Exercise name already exists' });
    }

    // Create new exercise
    const exercise = new Exercise({
      name,
      description: description || '',
      muscleGroup: Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup],
      equipment: Array.isArray(equipment) ? equipment : equipment ? [equipment] : [],
      difficulty,
      media: {
        imageUrl: media?.imageUrl || '',
        videoUrl: media?.videoUrl || ''
      }
    });

    // Save to MongoDB
    await exercise.save();

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise: {
        id: exercise._id,
        name: exercise.name,
        description: exercise.description,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        media: exercise.media
      }
    });
  } catch (err) {
    console.error('Create exercise error:', err.message);
    res.status(500).json({ message: 'Server error during exercise creation' });
  }
});

// @route   GET /api/exercises/get
// @desc    Get all exercises
// @access  Private
router.get('/get', authMiddleware, async (req, res) => {
  try {
    const exercises = await Exercise.find();
    
    res.status(200).json({
      message: 'Exercises retrieved successfully',
      exercises
    });
  } catch (err) {
    console.error('Get exercises error:', err.message);
    res.status(500).json({ message: 'Server error retrieving exercises' });
  }
});

// @route   PUT /api/exercises/update/:id
// @desc    Update an exercise by ID
// @access  Private
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { name, description, muscleGroup, equipment, difficulty, media } = req.body;

  try {
    // Find exercise
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Update fields
    exercise.name = name || exercise.name;
    exercise.description = description !== undefined ? description : exercise.description;
    exercise.muscleGroup = muscleGroup ? (Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup]) : exercise.muscleGroup;
    exercise.equipment = equipment ? (Array.isArray(equipment) ? equipment : [equipment]) : exercise.equipment;
    exercise.difficulty = difficulty || exercise.difficulty;
    exercise.media = {
      imageUrl: media?.imageUrl || exercise.media.imageUrl,
      videoUrl: media?.videoUrl || exercise.media.videoUrl
    };

    // Save updated exercise
    await exercise.save();

    res.status(200).json({
      message: 'Exercise updated successfully',
      exercise: {
        id: exercise._id,
        name: exercise.name,
        description: exercise.description,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        media: exercise.media
      }
    });
  } catch (err) {
    console.error('Update exercise error:', err.message);
    res.status(500).json({ message: 'Server error during exercise update' });
  }
});

// @route   DELETE /api/exercises/delete/:id
// @desc    Delete an exercise by ID
// @access  Private
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    // Find and delete exercise
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    await exercise.deleteOne();

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.error('Delete exercise error:', err.message);
    res.status(500).json({ message: 'Server error during exercise deletion' });
  }
});

// @route   GET /api/exercises/search
// @desc    Search exercises by muscle group and/or equipment
// @access  Private
router.get('/search', authMiddleware, async (req, res) => {
  const { muscleGroup, equipment } = req.query;

  try {
    // Build query
    const query = {};
    if (muscleGroup) {
      query.muscleGroup = { $in: Array.isArray(muscleGroup) ? muscleGroup : [muscleGroup] };
    }
    if (equipment) {
      query.equipment = { $in: Array.isArray(equipment) ? equipment : [equipment] };
    }

    // Find matching exercises
    const exercises = await Exercise.find(query);

    res.status(200).json({
      message: 'Exercises retrieved successfully',
      exercises
    });
  } catch (err) {
    console.error('Search exercises error:', err.message);
    res.status(500).json({ message: 'Server error during exercise search' });
  }
});

module.exports = router;
