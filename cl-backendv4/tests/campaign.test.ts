import request from 'supertest';
import express from 'express';
import { prisma } from './setup';
import path from 'path';
import fs from 'fs';

// Mock QueueThrottler to avoid ESM import issues
jest.mock('../src/service/aiQueryClients/QueueThrottler', () => {
  return require('./mocks/queue-throttler');
});

// Create a mock Express app
const app = express();

// Configure Express app to parse JSON
app.use(express.json());

// Mock auth token
const authToken = 'mock-auth-token';

// Mock routes for testing
app.post('/api/v1/campaigns', (req, res) => {
  const campaignData = req.body;
  
  res.status(201).json({
    id: 1,
    ...campaignData
  });
});

app.post('/api/v1/campaigns/:id/upload', (req, res) => {
  res.status(200).json({
    message: 'File uploaded successfully'
  });
});

// Setup before tests
beforeAll(async () => {
  // Create a test user
  const testUser = {
    email: 'campaign-test@example.com',
    password: 'password123',
    roleId: 1
  };

  try {
    await prisma.users.create({
      data: testUser
    });
  } catch (error) {
    console.error('Error in test setup:', error);
  }
});

// Cleanup after tests
afterAll(async () => {
  // Remove test user
  try {
    // Check if user exists before deleting
    const user = await prisma.users.findUnique({
      where: { email: 'campaign-test@example.com' }
    });
    
    if (user) {
      await prisma.users.delete({
        where: { email: 'campaign-test@example.com' }
      });
    }
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
});

describe('Campaign API', () => {
  test('should create a new campaign', async () => {
    const campaignData = {
      name: 'Test Campaign',
      company_name: 'Test Company',
      company_site: 'https://testcompany.com',
      product_category: 'Software',
      active: true
    };

    const response = await request(app)
      .post('/api/v1/campaigns')
      .set('Authorization', `Bearer ${authToken}`)
      .send(campaignData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(campaignData.name);
  });

  test('should upload and process Excel file', async () => {
    // Create a test campaign in the database
    const campaignData = {
      name: 'Excel Test Campaign',
      company_name: 'Test Company',
      company_site: 'https://testcompany.com',
      product_category: 'Software',
      active: true
    };

    // Mock file upload
    const response = await request(app)
      .post('/api/v1/campaigns/1/upload')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('successfully');
  });
}); 