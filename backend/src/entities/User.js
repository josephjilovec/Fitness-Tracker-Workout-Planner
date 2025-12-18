/**
 * @fileoverview User Entity (Domain Model)
 * @description Clean Architecture: Entity layer - Core business logic for User
 * @module entities/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Represents the core User entity with business rules
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username must be less than 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't return password by default
    },
    profile: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, 'Name must be less than 100 characters'],
        default: '',
      },
      age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age must be realistic'],
        default: null,
      },
      fitnessGoals: {
        type: [String],
        default: [],
        validate: {
          validator: (goals) => goals.length <= 10,
          message: 'Cannot have more than 10 fitness goals',
        },
      },
      bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Bio must be less than 500 characters'],
        default: '',
      },
      avatar: {
        type: String,
        trim: true,
        default: '',
      },
    },
    achievements: [
      {
        badgeName: {
          type: String,
          required: true,
          trim: true,
        },
        dateEarned: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
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
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Indexes for performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'profile.name': 'text' }); // Text search index

/**
 * Pre-save hook to hash password
 * Only hashes if password is modified
 */
UserSchema.pre('save', async function (next) {
  try {
    // Only hash password if it's been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    // Hash password with cost of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Instance method to compare password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} True if password matches
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Instance method to update last login
 */
UserSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

/**
 * Static method to find user by email or username
 * @param {string} identifier - Email or username
 * @returns {Promise<User|null>} User document or null
 */
UserSchema.statics.findByEmailOrUsername = function (identifier) {
  return this.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  });
};

/**
 * Static method to check if username exists
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} True if username exists
 */
UserSchema.statics.usernameExists = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

/**
 * Static method to check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
UserSchema.statics.emailExists = async function (email) {
  const user = await this.findOne({ email: email.toLowerCase() });
  return !!user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

