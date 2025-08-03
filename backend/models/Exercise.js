const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Exercise name must be at least 3 characters long']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  muscleGroup: {
    type: [String],
    required: [true, 'At least one muscle group is required'],
    enum: [
      'Chest',
      'Back',
      'Arms',
      'Shoulders',
      'Legs',
      'Core',
      'Full Body'
    ]
  },
  equipment: {
    type: [String],
    default: [],
    enum: [
      'None',
      'Dumbbells',
      'Barbell',
      'Kettlebell',
      'Resistance Band',
      'Machine',
      'Bodyweight'
    ]
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  media: {
    imageUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/, 'Please provide a valid image URL'],
      default: ''
    },
    videoUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.*\.(?:mp4|webm|ogg)$/, 'Please provide a valid video URL'],
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
