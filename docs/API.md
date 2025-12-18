# Fitness Tracker API Documentation

## Base URL

```
Production: https://api.fitness-tracker.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

```json
{
  "status": "success|error",
  "message": "Human-readable message",
  "data": { ... }
}
```

Error responses:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [ ... ] // Optional validation errors
}
```

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Endpoints

### Authentication

#### Register User

```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

#### Login

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

### Workouts

#### Create Workout

```http
POST /api/v1/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Morning Run",
  "description": "5K morning run",
  "exercises": ["exercise-id-1", "exercise-id-2"],
  "duration": 30,
  "caloriesBurned": 300,
  "date": "2024-01-15T08:00:00Z"
}
```

#### Get User Workouts

```http
GET /api/v1/workouts?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31&status=completed
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `startDate` (optional): Start date filter (ISO 8601)
- `endDate` (optional): End date filter (ISO 8601)
- `status` (optional): Workout status (planned, in-progress, completed, cancelled)

#### Get Workout Statistics

```http
GET /api/v1/workouts/stats?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Update Workout

```http
PUT /api/v1/workouts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "duration": 45
}
```

#### Delete Workout

```http
DELETE /api/v1/workouts/:id
Authorization: Bearer <token>
```

### Exercises

#### Create Exercise

```http
POST /api/v1/exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Push-ups",
  "description": "Classic push-up exercise",
  "muscleGroup": ["Chest", "Arms"],
  "equipment": ["Bodyweight"],
  "difficulty": "Beginner"
}
```

#### Search Exercises

```http
GET /api/v1/exercises?muscleGroup=Chest&equipment=Dumbbells&difficulty=Intermediate&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `muscleGroup` (optional): Filter by muscle group
- `equipment` (optional): Filter by equipment
- `difficulty` (optional): Filter by difficulty
- `search` (optional): Text search
- `page` (optional): Page number
- `limit` (optional): Results per page

#### Get Exercise by ID

```http
GET /api/v1/exercises/:id
Authorization: Bearer <token>
```

#### Update Exercise

```http
PUT /api/v1/exercises/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Exercise

```http
DELETE /api/v1/exercises/:id
Authorization: Bearer <token>
```

### Social Features

#### Create Post

```http
POST /api/v1/social/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Just completed a 5K run!",
  "workoutId": "workout-id-optional"
}
```

#### Get Posts

```http
GET /api/v1/social/posts?page=1&limit=20&userId=user-id-optional
Authorization: Bearer <token>
```

#### Like/Unlike Post

```http
POST /api/v1/social/posts/:id/like
Authorization: Bearer <token>
```

#### Create Comment

```http
POST /api/v1/social/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": "post-id",
  "content": "Great job!"
}
```

#### Get Comments

```http
GET /api/v1/social/comments?postId=post-id&page=1&limit=50
Authorization: Bearer <token>
```

#### Create Challenge

```http
POST /api/v1/social/challenges
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "30-Day Fitness Challenge",
  "description": "Complete 30 workouts in 30 days",
  "endDate": "2024-02-15T23:59:59Z"
}
```

#### Get Challenges

```http
GET /api/v1/social/challenges?page=1&limit=20
Authorization: Bearer <token>
```

#### Join Challenge

```http
POST /api/v1/social/challenges/:id/join
Authorization: Bearer <token>
```

### Health Check

#### Health Status

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "production",
  "database": {
    "status": "connected",
    "host": "mongodb://...",
    "name": "fitness-tracker"
  },
  "version": "2.0.0"
}
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (database disconnected)

## Validation Rules

### User Registration
- Username: 3-30 characters, alphanumeric and underscores only
- Email: Valid email format
- Password: Minimum 8 characters, must contain uppercase, lowercase, and number

### Workout
- Title: 3-100 characters
- Description: Max 500 characters
- Duration: 0-1440 minutes
- Calories: 0-10000

### Exercise
- Name: 3-100 characters, unique
- Muscle Groups: Must be from predefined list
- Equipment: Must be from predefined list
- Difficulty: Beginner, Intermediate, or Advanced

## Pagination

Paginated responses include:

```json
{
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## Best Practices

1. Always include the Authorization header for protected endpoints
2. Handle rate limiting gracefully
3. Implement retry logic for transient errors
4. Cache responses when appropriate
5. Use pagination for list endpoints
6. Validate input on the client side
7. Handle network errors gracefully

