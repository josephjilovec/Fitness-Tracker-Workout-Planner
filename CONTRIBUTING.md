# Contributing to Fitness Tracker

Thank you for your interest in contributing to Fitness Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Follow the project's coding standards

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Fitness-Tracker-Workout-Planner.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Coding Standards

### Backend (Node.js/Express)

- Follow ESLint configuration (Airbnb base)
- Use async/await for asynchronous operations
- Write JSDoc comments for all functions
- Follow Clean Architecture principles:
  - Entities: Domain models
  - Use Cases: Business logic
  - Routes: HTTP handlers
  - Middleware: Cross-cutting concerns

### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use PropTypes or TypeScript for type checking
- Keep components small and focused
- Use meaningful variable and function names

### Git Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: Add workout statistics endpoint`

## Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

## Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

- Aim for >80% code coverage
- Write unit tests for all new features
- Write integration tests for API endpoints

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new features
4. Ensure code follows style guidelines
5. Update CHANGELOG.md if applicable
6. Request review from maintainers

## Code Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling is comprehensive

## Reporting Bugs

Use the GitHub Issues template and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Suggesting Features

Use the GitHub Issues template and include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Alternatives considered

## Questions?

Open an issue with the `question` label or contact the maintainers.

Thank you for contributing! 🎉

