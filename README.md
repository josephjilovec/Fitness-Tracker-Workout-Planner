Fitness Tracker

Fitness Tracker is a full-stack web application designed to help users track workouts, manage fitness goals, and engage in social interactions. Built with a Node.js/Express backend and a React frontend, it uses MongoDB for data storage, JWT for authentication, and Chart.js for visualizing workout statistics. The application is containerized with Docker and deployable on AWS, ensuring scalability and reliability. This project aims to provide a user-friendly platform for fitness enthusiasts to plan, track, and share their fitness journeys.

Project Overview

Fitness Tracker enables users to create and manage workout plans, explore an exercise library, update profiles, visualize progress, and connect via social features like posts, comments, and challenges. Key features include:

User Management: Secure registration and login with JWT and bcrypt.
Workout Planning: Create, edit, and schedule workouts with a calendar interface.
Exercise Library: Searchable database of exercises with filters for muscle group and equipment.
Data Visualization: Line charts for workout duration and calories burned over time.
Social Features: Share posts, comment, like, and join fitness challenges.
Deployment: Dockerized for local or cloud deployment (AWS Elastic Beanstalk).

The repository is structured for modularity, with comprehensive tests (>80% coverage) using Mocha/Chai for the backend and Jest for the frontend, and a CI/CD pipeline via GitHub Actions.
Repository Structure
Fitness-Tracker/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Workout.js           # Workout schema
│   │   ├── Exercise.js          # Exercise schema
│   ├── routes/
│   │   ├── users.js             # User auth routes
│   │   ├── workouts.js          # Workout CRUD and stats routes
│   │   ├── exercises.js         # Exercise CRUD and search routes
│   │   ├── social.js            # Social features (posts, comments, challenges)
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   └── index.js                 # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   ├── Dashboard.js     # User dashboard
│   │   │   ├── WorkoutPlanner.js # Workout creation and scheduling
│   │   │   ├── ExerciseLibrary.js # Exercise search and details
│   │   │   ├── UserProfile.js   # User profile management
│   │   │   ├── DataVisualization.js # Chart.js progress visualizations
│   │   │   └── SocialFeed.js    # Social posts and interactions
│   │   ├── App.js               # Main React app with routing
│   │   ├── index.js             # React entry point
│   │   └── styles/              # Tailwind CSS and custom styles
│   └── public/                  # Static assets
├── docs/
│   ├── architecture.md          # System architecture
│   ├── api_endpoints.md         # API endpoint documentation
│   └── privacy_policy.md        # Data privacy policy
├── deploy/
│   ├── Dockerfile               # Docker setup
│   ├── package.json             # Node.js dependencies
│   └── aws_config.yml           # AWS deployment config
├── .github/
│   └── workflows/
│       └── ci.yml               # CI/CD pipeline
├── .env                         # Environment variables
├── .gitignore                   # Ignore node_modules, .env
├── README.md                    # Project overview
└── LICENSE                      # MIT license

Setup Instructions
Prerequisites

Node.js: v18
MongoDB: Local instance or MongoDB Atlas
Docker: Latest version (optional for containerized deployment)
Git: For cloning the repository

Installation

Clone the Repository:
git clone https://github.com/josephjilovec/Fitness-Tracker.git
cd Fitness-Tracker


Install Backend Dependencies:
cd backend
npm install


Install Frontend Dependencies:
cd frontend
npm install


Set Up MongoDB:

Install MongoDB locally or use MongoDB Atlas for a cloud database.
Create a .env file in the root directory with:MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_jwt_secret
PORT=5000

Replace MONGODB_URI with your MongoDB connection string and JWT_SECRET with a secure string.


Run Locally:

Start the backend:cd backend
npm start


In a new terminal, start the frontend:cd frontend
npm start


Access the app at http://localhost:3000.


Run with Docker:

Build the Docker image:docker build -t fitness-tracker -f deploy/Dockerfile .


Run the container:docker run -p 5000:5000 -e MONGODB_URI=<your_mongodb_uri> -e JWT_SECRET=<your_jwt_secret> fitness-tracker


Access at http://localhost:5000.



Deploying to the Cloud
To deploy Fitness Tracker for public access, use AWS Elastic Beanstalk:

Install AWS CLI: npm install -g aws-cli.
Configure AWS credentials:aws configure

Enter AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and set region to us-east-1.
Build and push Docker image:docker build -t fitness-tracker -f deploy/Dockerfile .
docker tag fitness-tracker:latest your_docker_username/fitness-tracker:latest
docker push your_docker_username/fitness-tracker:latest


Deploy to Elastic Beanstalk:eb init -p docker fitness-tracker --region us-east-1
eb create fitness-tracker-env --single --instance_type t3.medium
eb deploy fitness-tracker-env


Set environment variables:eb setenv MONGODB_URI=<your_mongodb_uri> JWT_SECRET=<your_jwt_secret> PORT=5000


Access the app at http://fitness-tracker-env.<random-id>.us-east-1.elasticbeanstalk.com.

Live Demo
A live demo is not currently hosted. To test Fitness Tracker, follow the setup instructions above to run locally or deploy to a cloud platform like AWS or DigitalOcean. Deployment may incur costs (~$12-$50/month).
Usage Examples
1. Register a User
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"secure123"}'

2. Create a Workout
curl -X POST http://localhost:5000/api/workouts/create \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Morning Run","exercises":["<exercise_id>"],"duration":30,"caloriesBurned":300}'

3. Search Exercises
curl -X GET "http://localhost:5000/api/exercises/search?muscleGroup=Chest" \
  -H "Authorization: Bearer <jwt_token>"

4. Create a Post
curl -X POST http://localhost:5000/api/social/posts \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Completed a 5K run today!"}'

5. View the Dashboard

Run the app locally (npm start in frontend/).
Navigate to http://localhost:3000 to view workout history, profile, and social feed.

Testing
Run backend and frontend tests:
cd backend
npm test
cd ../frontend
npm test

Tests use Mocha/Chai for backend and Jest for frontend, ensuring >80% coverage.
Contributing
Contributions are welcome under the MIT License. Please:

Fork the repository and create a feature branch (feature/your-feature).
Submit pull requests to the develop branch.
Ensure tests pass and add new tests for new features.
Follow ESLint code style guidelines.

License
Fitness Tracker is licensed under the MIT License. See LICENSE for details.
Contact
For questions or issues, contact Joseph Jilovec or open an issue on GitHub.
