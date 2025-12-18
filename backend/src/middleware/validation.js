/**
 * @fileoverview Input validation middleware
 * @description Production-ready input validation using express-validator and Joi
 * @module middleware/validation
 */

const { body, query, param, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Middleware to handle validation errors
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    throw new ValidationError('Validation failed', errorMessages);
  }
  next();
};

/**
 * User registration validation rules
 */
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors,
];

/**
 * User login validation rules
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Workout creation validation rules
 */
const validateCreateWorkout = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required')
    .custom((exercises) => {
      if (!exercises.every((id) => typeof id === 'string' && id.length === 24)) {
        throw new Error('All exercise IDs must be valid MongoDB ObjectIds');
      }
      return true;
    }),
  body('duration')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Duration must be between 0 and 1440 minutes'),
  body('caloriesBurned')
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage('Calories burned must be between 0 and 10000'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  handleValidationErrors,
];

/**
 * Workout update validation rules
 */
const validateUpdateWorkout = [
  param('id')
    .isMongoId()
    .withMessage('Invalid workout ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('exercises')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Exercises array must contain at least one exercise'),
  body('duration')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Duration must be between 0 and 1440 minutes'),
  body('caloriesBurned')
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage('Calories burned must be between 0 and 10000'),
  handleValidationErrors,
];

/**
 * Exercise creation validation rules
 */
const validateCreateExercise = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Exercise name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('muscleGroup')
    .isArray({ min: 1 })
    .withMessage('At least one muscle group is required')
    .custom((groups) => {
      const validGroups = ['Chest', 'Back', 'Arms', 'Shoulders', 'Legs', 'Core', 'Full Body'];
      return groups.every((group) => validGroups.includes(group));
    })
    .withMessage('Invalid muscle group'),
  body('equipment')
    .optional()
    .isArray()
    .custom((equipment) => {
      const validEquipment = ['None', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Band', 'Machine', 'Bodyweight'];
      return equipment.every((item) => validEquipment.includes(item));
    })
    .withMessage('Invalid equipment type'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  body('media.imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('media.videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  handleValidationErrors,
];

/**
 * Exercise search validation rules
 */
const validateExerciseSearch = [
  query('muscleGroup')
    .optional()
    .custom((value) => {
      const validGroups = ['Chest', 'Back', 'Arms', 'Shoulders', 'Legs', 'Core', 'Full Body'];
      if (Array.isArray(value)) {
        return value.every((group) => validGroups.includes(group));
      }
      return validGroups.includes(value);
    })
    .withMessage('Invalid muscle group'),
  query('equipment')
    .optional()
    .custom((value) => {
      const validEquipment = ['None', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Band', 'Machine', 'Bodyweight'];
      if (Array.isArray(value)) {
        return value.every((item) => validEquipment.includes(item));
      }
      return validEquipment.includes(value);
    })
    .withMessage('Invalid equipment type'),
  query('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty level'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

/**
 * Post creation validation rules
 */
const validateCreatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Post content must be between 1 and 1000 characters'),
  handleValidationErrors,
];

/**
 * Comment creation validation rules
 */
const validateCreateComment = [
  body('postId')
    .isMongoId()
    .withMessage('Invalid post ID'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment content must be between 1 and 500 characters'),
  handleValidationErrors,
];

/**
 * MongoDB ID parameter validation
 */
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateWorkout,
  validateUpdateWorkout,
  validateCreateExercise,
  validateExerciseSearch,
  validateCreatePost,
  validateCreateComment,
  validateMongoId,
  handleValidationErrors,
};

