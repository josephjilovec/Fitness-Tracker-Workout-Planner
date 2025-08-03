const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profile: {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      default: null
    },
    fitnessGoals: {
      type: [String],
      default: []
    }
  },
  achievements: [{
    badgeName: {
      type: String,
      required: true
    },
    dateEarned: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    console.error('Error hashing password:', err.message);
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
