/**
 * @fileoverview Example Test File
 * @description Example test structure for backend tests
 * @module tests/example
 */

const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/server');
const User = require('../src/entities/User');
const { connectDB, disconnectDB } = require('../src/database/connection');

describe('Example Test Suite', () => {
  before(async () => {
    // Connect to test database
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/fitness-tracker-test';
    await connectDB();
  });

  after(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
      };

      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData)
        .expect(201);

      expect(res.body.status).to.equal('success');
      expect(res.body.data.user).to.have.property('id');
      expect(res.body.data.user.username).to.equal(userData.username);
      expect(res.body.data).to.have.property('token');
    });

    it('should reject duplicate username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
      };

      // Create first user
      await request(app)
        .post('/api/v1/users/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData)
        .expect(409);

      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.include('already exists');
    });

    it('should validate password requirements', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak', // Too weak
      };

      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData)
        .expect(422);

      expect(res.body.status).to.equal('error');
      expect(res.body.errors).to.be.an('array');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create test user
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
      };

      await request(app)
        .post('/api/v1/users/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const credentials = {
        username: 'testuser',
        password: 'TestPass123',
      };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(credentials)
        .expect(200);

      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user.username).to.equal(credentials.username);
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        username: 'testuser',
        password: 'WrongPassword',
      };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(credentials)
        .expect(401);

      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.include('Invalid credentials');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.status).to.equal('ok');
      expect(res.body).to.have.property('database');
      expect(res.body).to.have.property('uptime');
    });
  });
});

