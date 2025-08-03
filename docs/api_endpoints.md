Fitness Tracker API Endpoints Documentation
This document details the REST API endpoints defined in the backend/routes/ directory of the Fitness Tracker application. These endpoints, implemented using Node.js/Express, handle user authentication, workout management, exercise operations, and social features. Each endpoint includes its URL, HTTP method, parameters, response format, and example usage for developers integrating with the system.
Base URL
All endpoints are relative to the base URL: /api
Authentication
Protected endpoints require a JSON Web Token (JWT) in the Authorization header with the format: Bearer <token>. Obtain the token via the /api/users/login endpoint.
1. Users Endpoints (backend/routes/users.js)
1.1. Register User

URL: /users/register
Method: POST
Access: Public
Description: Creates a new user account with hashed password.
Parameters (Body):
username (string, required): Unique username.
email (string, required): Unique email address.
password (string, required): Password (min 6 characters).


Response:
201 Created:{
  "message": "User registered successfully",
  "token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "username": "<username>",
    "email": "<email>"
  }
}


400 Bad Request: If username/email exists or input is invalid.{ "message": "Username or email already exists" }


500 Server Error:{ "message": "Server error during registration" }




Example:curl -X POST http://localhost:5000/api/users/register \
-H "Content-Type: application/json" \
-d '{"username":"john_doe","email":"john@example.com","password":"secure123"}'



1.2. Login User

URL: /users/login
Method: POST
Access: Public
Description: Authenticates a user and returns a JWT.
Parameters (Body):
username (string, required): User's username.
password (string, required): User's password.


Response:
200 OK:{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "username": "<username>",
    "email": "<email>"
  }
}


401 Unauthorized: If credentials are invalid.{ "message": "Invalid credentials" }


500 Server Error:{ "message": "Server error during login" }




Example:curl -X POST http://localhost:5000/api/users/login \
-H "Content-Type: application/json" \
-d '{"username":"john_doe","password":"secure123"}'



2. Workouts Endpoints (backend/routes/workouts.js)
2.1. Create Workout

URL: /workouts/create
Method: POST
Access: Private (JWT required)
Description: Creates a new workout for the authenticated user.
Parameters (Body):
title (string, required): Workout title.
description (string): Optional description.
exercises (array of ObjectIds, required): List of exercise IDs.
duration (number): Duration in minutes.
caloriesBurned (number): Calories burned.


Response:
201 Created:{
  "message": "Workout created successfully",
  "workout": {
    "id": "<workout_id>",
    "title": "<title>",
    "description": "<description>",
    "exercises": ["<exercise_id>", ...],
    "duration": <number>,
    "caloriesBurned": <number>,
    "date": "<ISO_date>"
  }
}


400 Bad Request: If required fields are missing.{ "message": "Title and exercises array are required" }


500 Server Error:{ "message": "Server error during workout creation" }




Example:curl -X POST http://localhost:5000/api/workouts/create \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"title":"Morning Run","exercises":["<exercise_id>"],"duration":30,"caloriesBurned":300}'



2.2. Get Workouts

URL: /workouts/get
Method: GET
Access: Private (JWT required)
Description: Retrieves all workouts for the authenticated user.
Parameters: None
Response:
200 OK:{
  "message": "Workouts retrieved successfully",
  "workouts": [
    {
      "id": "<workout_id>",
      "title": "<title>",
      "description": "<description>",
      "exercises": [{ "name": "<name>", "muscleGroup": [], "difficulty": "<difficulty>" }, ...],
      "duration": <number>,
      "caloriesBurned": <number>,
      "date": "<ISO_date>"
    },
    ...
  ]
}


500 Server Error:{ "message": "Server error retrieving workouts" }




Example:curl -X GET http://localhost:5000/api/workouts/get \
-H "Authorization: Bearer <jwt_token>"



2.3. Update Workout

URL: /workouts/update/:id
Method: PUT
Access: Private (JWT required)
Description: Updates a workout by ID for the authenticated user.
Parameters:
URL: :id (string, required): Workout ID.
Body:
title (string): Updated title.
description (string): Updated description.
exercises (array of ObjectIds): Updated exercise IDs.
duration (number): Updated duration.
caloriesBurned (number): Updated calories.




Response:
200 OK:{
  "message": "Workout updated successfully",
  "workout": {
    "id": "<workout_id>",
    "title": "<title>",
    "description": "<description>",
    "exercises": ["<exercise_id>", ...],
    "duration": <number>,
    "caloriesBurned": <number>,
    "date": "<ISO_date>"
  }
}


404 Not Found:{ "message": "Workout not found" }


403 Forbidden:{ "message": "Unauthorized to update this workout" }


500 Server Error:{ "message": "Server error during workout update" }




Example:curl -X PUT http://localhost:5000/api/workouts/update/<workout_id> \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"title":"Updated Run","duration":45}'



2.4. Delete Workout

URL: /workouts/delete/:id
Method: DELETE
Access: Private (JWT required)
Description: Deletes a workout by ID for the authenticated user.
Parameters:
URL: :id (string, required): Workout ID.


Response:
200 OK:{ "message": "Workout deleted successfully" }


404 Not Found:{ "message": "Workout not found" }


403 Forbidden:{ "message": "Unauthorized to delete this workout" }


500 Server Error:{ "message": "Server error during workout deletion" }




Example:curl -X DELETE http://localhost:5000/api/workouts/delete/<workout_id> \
-H "Authorization: Bearer <jwt_token>"



2.5. Get Workout Stats

URL: /workouts/stats
Method: GET
Access: Private (JWT required)
Description: Aggregates workout duration, calories, and count by date.
Parameters: None
Response:
200 OK:{
  "message": "Stats retrieved successfully",
  "stats": [
    {
      "_id": "2025-08-03",
      "totalDuration": <number>,
      "totalCalories": <number>,
      "workoutCount": <number>
    },
    ...
  ]
}


500 Server Error:{ "message": "Server error retrieving stats" }




Example:curl -X GET http://localhost:5000/api/workouts/stats \
-H "Authorization: Bearer <jwt_token>"



3. Exercises Endpoints (backend/routes/exercises.js)
3.1. Create Exercise

URL: /exercises/create
Method: POST
Access: Private (JWT required)
Description: Creates a new exercise.
Parameters (Body):
name (string, required): Unique exercise name.
description (string): Optional description.
muscleGroup (array of strings, required): Muscle groups (e.g., ["Chest", "Arms"]).
equipment (array of strings): Equipment (e.g., ["Dumbbells"]).
difficulty (string, required): Difficulty level (Beginner, Intermediate, Advanced).
media (object): Optional image/video URLs.
imageUrl (string): Image URL.
videoUrl (string): Video URL.




Response:
201 Created:{
  "message": "Exercise created successfully",
  "exercise": {
    "id": "<exercise_id>",
    "name": "<name>",
    "description": "<description>",
    "muscleGroup": ["<muscle>", ...],
    "equipment": ["<equipment>", ...],
    "difficulty": "<difficulty>",
    "media": { "imageUrl": "<url>", "videoUrl": "<url>" }
  }
}


400 Bad Request:{ "message": "Name, muscle group, and difficulty are required" }


500 Server Error:{ "message": "Server error during exercise creation" }




Example:curl -X POST http://localhost:5000/api/exercises/create \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"name":"Push Up","muscleGroup":["Chest","Arms"],"difficulty":"Beginner","media":{"imageUrl":"https://example.com/pushup.jpg"}}'



3.2. Get Exercises

URL: /exercises/get
Method: GET
Access: Private (JWT required)
Description: Retrieves all exercises.
Parameters: None
Response:
200 OK:{
  "message": "Exercises retrieved successfully",
  "exercises": [
    {
      "id": "<exercise_id>",
      "name": "<name>",
      "description": "<description>",
      "muscleGroup": ["<muscle>", ...],
      "equipment": ["<equipment>", ...],
      "difficulty": "<difficulty>",
      "media": { "imageUrl": "<url>", "videoUrl": "<url>" }
    },
    ...
  ]
}


500 Server Error:{ "message": "Server error retrieving exercises" }




Example:curl -X GET http://localhost:5000/api/exercises/get \
-H "Authorization: Bearer <jwt_token>"



3.3. Update Exercise

URL: /exercises/update/:id
Method: PUT
Access: Private (JWT required)
Description: Updates an exercise by ID.
Parameters:
URL: :id (string, required): Exercise ID.
Body: Same as create (optional fields).


Response:
200 OK:{
  "message": "Exercise updated successfully",
  "exercise": {
    "id": "<exercise_id>",
    "name": "<name>",
    "description": "<description>",
    "muscleGroup": ["<muscle>", ...],
    "equipment": ["<equipment>", ...],
    "difficulty": "<difficulty>",
    "media": { "imageUrl": "<url>", "videoUrl": "<url>" }
  }
}


404 Not Found:{ "message": "Exercise not found" }


500 Server Error:{ "message": "Server error during exercise update" }




Example:curl -X PUT http://localhost:5000/api/exercises/update/<exercise_id> \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"name":"Updated Push Up","difficulty":"Intermediate"}'



3.4. Delete Exercise

URL: /exercises/delete/:id
Method: DELETE
Access: Private (JWT required)
Description: Deletes an exercise by ID.
Parameters:
URL: :id (string, required): Exercise ID.


Response:
200 OK:{ "message": "Exercise deleted successfully" }


404 Not Found:{ "message": "Exercise not found" }


500 Server Error:{ "message": "Server error during exercise deletion" }




Example:curl -X DELETE http://localhost:5000/api/exercises/delete/<exercise_id> \
-H "Authorization: Bearer <jwt_token>"



3.5. Search Exercises

URL: /exercises/search
Method: GET
Access: Private (JWT required)
Description: Searches exercises by muscle group and/or equipment.
Parameters (Query):
muscleGroup (string or array): Muscle groups to filter (e.g., "Chest" or ["Chest","Arms"]).
equipment (string or array): Equipment to filter (e.g., "Dumbbells").


Response:
200 OK:{
  "message": "Exercises retrieved successfully",
  "exercises": [
    {
      "id": "<exercise_id>",
      "name": "<name>",
      "description": "<description>",
      "muscleGroup": ["<muscle>", ...],
      "equipment": ["<equipment>", ...],
      "difficulty": "<difficulty>",
      "media": { "imageUrl": "<url>", "videoUrl": "<url>" }
    },
    ...
  ]
}


500 Server Error:{ "message": "Server error during exercise search" }




Example:curl -X GET "http://localhost:5000/api/exercises/search?muscleGroup=Chest&equipment=Dumbbells" \
-H "Authorization: Bearer <jwt_token>"



4. Social Endpoints (backend/routes/social.js)
4.1. Create Post

URL: /social/posts
Method: POST
Access: Private (JWT required)
Description: Creates a new social post.
Parameters (Body):
content (string, required): Post content.


Response:
201 Created:{
  "message": "Post created successfully",
  "post": {
    "id": "<post_id>",
    "content": "<content>",
    "userId": "<user_id>",
    "likes": [],
    "createdAt": "<ISO_date>"
  }
}


400 Bad Request:{ "message": "Content is required" }


500 Server Error:{ "message": "Server error during post creation" }




Example:curl -X POST http://localhost:5000/api/social/posts \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"content":"Completed a 5K run today!"}'



4.2. Get Posts

URL: /social/posts
Method: GET
Access: Private (JWT required)
Description: Retrieves all posts with user information.
Parameters: None
Response:
200 OK:{
  "message": "Posts retrieved successfully",
  "posts": [
    {
      "id": "<post_id>",
      "content": "<content>",
      "userId": { "username": "<username>" },
      "likes": ["<user_id>", ...],
      "createdAt": "<ISO_date>"
    },
    ...
  ]
}


500 Server Error:{ "message": "Server error retrieving posts" }




Example:curl -X GET http://localhost:5000/api/social/posts \
-H "Authorization: Bearer <jwt_token>"



4.3. Add Comment

URL: /social/comments
Method: POST
Access: Private (JWT required)
Description: Adds a comment to a post.
Parameters (Body):
postId (string, required): Post ID.
content (string, required): Comment content.


Response:
201 Created:{
  "message": "Comment added successfully",
  "comment": {
    "id": "<comment_id>",
    "content": "<content>",
    "userId": "<user_id>",
    "postId": "<post_id>",
    "createdAt": "<ISO_date>"
  }
}


400 Bad Request:{ "message": "Post ID and content are required" }


404 Not Found:{ "message": "Post not found" }


500 Server Error:{ "message": "Server error during comment creation" }




Example:curl -X POST http://localhost:5000/api/social/comments \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"postId":"<post_id>","content":"Great job!"}'



4.4. Get Comments

URL: /social/comments
Method: GET
Access: Private (JWT required)
Description: Retrieves comments for a post.
Parameters (Query):
postId (string, required): Post ID.


Response:
200 OK:{
  "message": "Comments retrieved successfully",
  "comments": [
    {
      "id": "<comment_id>",
      "content": "<content>",
      "userId": { "username": "<username>" },
      "postId": "<post_id>",
      "createdAt": "<ISO_date>"
    },
    ...
  ]
}


400 Bad Request:{ "message": "Post ID is required" }


500 Server Error:{ "message": "Server error retrieving comments" }




Example:curl -X GET "http://localhost:5000/api/social/comments?postId=<post_id>" \
-H "Authorization: Bearer <jwt_token>"



4.5. Toggle Like

URL: /social/likes
Method: POST
Access: Private (JWT required)
Description: Toggles a like on a post.
Parameters (Body):
postId (string, required): Post ID.


Response:
200 OK:{
  "message": "Post liked successfully",
  "likes": ["<user_id>", ...]
}

or{
  "message": "Post unliked successfully",
  "likes": ["<user_id>", ...]
}


400 Bad Request:{ "message": "Post ID is required" }


404 Not Found:{ "message": "Post not found" }


500 Server Error:{ "message": "Server error during like toggle" }




Example:curl -X POST http://localhost:5000/api/social/likes \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"postId":"<post_id>"}'



4.6. Join Challenge

URL: /social/challenges
Method: POST
Access: Private (JWT required)
Description: Joins a challenge for the authenticated user.
Parameters (Body):
challengeId (string, required): Challenge ID.


Response:
200 OK:{
  "message": "Joined challenge successfully",
  "challenge": {
    "id": "<challenge_id>",
    "title": "<title>",
    "description": "<description>",
    "participants": ["<user_id>", ...]
  }
}


400 Bad Request:{ "message": "Challenge ID is required" }


404 Not Found:{ "message": "Challenge not found" }


500 Server Error:{ "message": "Server error during challenge join" }




Example:curl -X POST http://localhost:5000/api/social/challenges \
-H "Authorization: Bearer <jwt_token>" \
-H "Content-Type: application/json" \
-d '{"challengeId":"<challenge_id>"}'



4.7. Get Challenges

URL: /social/challenges
Method: GET
Access: Private (JWT required)
Description: Retrieves all challenges.
Parameters: None
Response:
200 OK:{
  "message": "Challenges retrieved successfully",
  "challenges": [
    {
      "id": "<challenge_id>",
      "title": "<title>",
      "description": "<description>",
      "participants": [{ "username": "<username>" }, ...],
      "createdAt": "<ISO_date>"
    },
    ...
  ]
}


500 Server Error:{ "message": "Server error retrieving challenges" }




Example:curl -X GET http://localhost:5000/api/social/challenges \
-H "Authorization: Bearer <jwt_token>"



Notes for Developers

Authentication: Use the /users/login endpoint to obtain a JWT for protected routes. Include it in the Authorization header as Bearer <token>.
Error Handling: All endpoints include robust error handling, returning descriptive JSON messages for client-side handling.
MongoDB: Ensure MongoDB is running and the MONGODB_URI is set in .env.
Testing: Use tests/backend/ scripts (Mocha/Chai) to test endpoints. Mock API calls to avoid live database interactions.
Extending APIs:
Add new endpoints in routes/ with similar structure (Express router, auth middleware).
Update Mongoose schemas in models/ for new data types.
Ensure frontend components (frontend/src/components/) handle new API responses.



This documentation provides a comprehensive guide for integrating with the Fitness Tracker API, ensuring developers can effectively interact with all endpoints.
