# Fitness Tracker - Production-Ready Workout Planner

[![CI/CD](https://github.com/your-username/Fitness-Tracker-Workout-Planner/workflows/CI/badge.svg)](https://github.com/your-username/Fitness-Tracker-Workout-Planner/actions)
[![Code Coverage](https://codecov.io/gh/your-username/Fitness-Tracker-Workout-Planner/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/Fitness-Tracker-Workout-Planner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready, full-stack fitness tracking application built with **Clean Architecture** principles. Features comprehensive workout planning, exercise library, social interactions, and data visualization.

## 🚀 Features

- **User Management**: Secure registration and authentication with JWT
- **Workout Planning**: Create, edit, and schedule workouts with calendar integration
- **Exercise Library**: Searchable database with filters for muscle groups and equipment
- **Data Visualization**: Charts and statistics for workout progress
- **Social Features**: Posts, comments, likes, and fitness challenges
- **Production-Ready**: Comprehensive error handling, logging, security, and monitoring

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
backend/src/
├── entities/          # Domain models (User, Workout, Exercise, etc.)
├── useCases/         # Business logic (RegisterUser, CreateWorkout, etc.)
├── routes/           # HTTP handlers (RESTful API endpoints)
├── middleware/       # Cross-cutting concerns (auth, validation, security)
├── database/         # Database connection and configuration
├── utils/            # Utilities (logger, errors, helpers)
└── config/           # Configuration management
```

### Key Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Clean Architecture**: Entities → Use Cases → Interfaces → Frameworks
- **Security First**: Input validation, sanitization, rate limiting, secure headers
- **Observability**: Comprehensive logging, error tracking, health checks
- **Scalability**: Database indexing, query optimization, horizontal scaling support

## 📋 Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB 7.0 or higher (local or Atlas)
- Git

## 🛠️ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/Fitness-Tracker-Workout-Planner.git
cd Fitness-Tracker-Workout-Planner
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions for all platforms
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment guide
- [Architecture](./docs/architecture.md) - System architecture and design decisions
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: express-validator with custom rules
- **Rate Limiting**: Protection against brute force and DDoS
- **Security Headers**: Helmet.js for secure HTTP headers
- **Input Sanitization**: XSS and MongoDB injection protection
- **CORS**: Configurable cross-origin resource sharing

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

## 🚢 Deployment

### Docker

```bash
docker build -t fitness-tracker -f deploy/Dockerfile .
docker run -p 5000:5000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-secret \
  fitness-tracker
```

### AWS Elastic Beanstalk

```bash
eb init -p docker fitness-tracker
eb create fitness-tracker-env
eb deploy
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 📊 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Authenticate user

### Workouts
- `GET /api/v1/workouts` - Get user workouts
- `POST /api/v1/workouts` - Create workout
- `PUT /api/v1/workouts/:id` - Update workout
- `DELETE /api/v1/workouts/:id` - Delete workout
- `GET /api/v1/workouts/stats` - Get workout statistics

### Exercises
- `GET /api/v1/exercises` - Search exercises
- `POST /api/v1/exercises` - Create exercise
- `GET /api/v1/exercises/:id` - Get exercise by ID
- `PUT /api/v1/exercises/:id` - Update exercise
- `DELETE /api/v1/exercises/:id` - Delete exercise

### Social
- `GET /api/v1/social/posts` - Get posts
- `POST /api/v1/social/posts` - Create post
- `POST /api/v1/social/posts/:id/like` - Like/unlike post
- `POST /api/v1/social/comments` - Create comment
- `GET /api/v1/social/comments` - Get comments
- `GET /api/v1/social/challenges` - Get challenges
- `POST /api/v1/social/challenges/:id/join` - Join challenge

### Health
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

See [API Documentation](./docs/API.md) for complete details.

## 🏛️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Winston** - Logging
- **Joi/express-validator** - Validation

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **ESLint** - Code linting
- **Mocha/Chai** - Testing

## 📈 Performance

- Database indexes on frequently queried fields
- Query optimization with aggregation pipelines
- Response compression
- Efficient pagination
- Connection pooling

## 🔍 Monitoring

- Health check endpoints
- Comprehensive logging (Winston)
- Error tracking ready (Sentry integration)
- Performance metrics
- Database connection monitoring

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.

## 👥 Authors

- **Joseph Jilovec** - Initial work

## 🙏 Acknowledgments

- Clean Architecture principles by Robert C. Martin
- Express.js community
- React community
- MongoDB community

## 📞 Support

For support, email support@fitness-tracker.com or open an issue on GitHub.

---

**Built with ❤️ using Clean Architecture principles**
