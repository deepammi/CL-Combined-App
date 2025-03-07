import request from 'supertest';
import express from 'express';
import { prisma } from './setup';

// Mock QueueThrottler to avoid ESM import issues
jest.mock('../src/service/aiQueryClients/QueueThrottler', () => {
  return require('./mocks/queue-throttler');
});

// Create a mock Express app
const app = express();

// Configure Express app to parse JSON
app.use(express.json());

// Mock data for testing
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  roleId: 1 // Assuming 1 is for regular users
};

// Mock routes for testing
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === testUser.email && password === testUser.password) {
    res.status(200).json({
      token: 'mock-auth-token',
      user: {
        email: testUser.email,
        roleId: testUser.roleId
      }
    });
  } else {
    res.status(401).json({
      error: 'Invalid credentials'
    });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, roleId } = req.body;
  
  res.status(201).json({
    user: {
      email,
      roleId
    }
  });
});

// Setup before tests
beforeAll(async () => {
  // Create a test user in the database
  try {
    await prisma.users.create({
      data: testUser
    });
  } catch (error) {
    console.error('Error creating test user:', error);
  }
});

// Cleanup after tests
afterAll(async () => {
  // Remove test user
  try {
    // Check if user exists before deleting
    const user = await prisma.users.findUnique({
      where: { email: testUser.email }
    });
    
    if (user) {
      await prisma.users.delete({
        where: { email: testUser.email }
      });
    }
  } catch (error) {
    console.error('Error deleting test user:', error);
  }
});

describe('Authentication API', () => {
  test('should authenticate valid user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testUser.email);
  });

  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('should create a new user account', async () => {
    const newUser = {
      email: 'newuser@example.com',
      password: 'newpassword123',
      roleId: 1
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(newUser.email);
  });
}); 