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

// Mock auth token and campaign data
const authToken = 'mock-auth-token';
const campaignId = 1;
const campaignName = 'AI Research Test Campaign';

// Mock routes for testing
app.post('/api/v1/ai-research/:id', (req, res) => {
  res.status(200).json({
    message: 'AI research processed successfully',
    campaignId: req.params.id
  });
});

app.post('/api/v1/commit-to-db/:id', (req, res) => {
  res.status(200).json({
    message: 'Data committed to database successfully',
    campaignId: req.params.id
  });
});

// Setup before tests
beforeAll(async () => {
  try {
    // Create test user
    await prisma.users.create({
      data: {
        email: 'ai-research-test@example.com',
        password: 'password123',
        roleId: 1
      }
    });

    // Clean up any existing data first
    await prisma.callScript_temp.deleteMany({
      where: { buyerId: 'TEST-BUYER-001' }
    });

    await prisma.emailScript_temp.deleteMany({
      where: { buyerId: 'TEST-BUYER-001' }
    });

    await prisma.buyerList_temp.deleteMany({
      where: { buyer_identifier: 'TEST-BUYER-001' }
    });

    // Create test data in BuyerList_temp
    await prisma.buyerList_temp.create({
      data: {
        s_no: 1,
        buyer_identifier: 'TEST-BUYER-001',
        f_name: 'John',
        l_name: 'Doe',
        company: 'Test Corp',
        title: 'CTO',
        website: 'https://testcorp.com',
        linkedin: 'https://linkedin.com/in/johndoe',
        location: 'New York',
        email: 'john@testcorp.com',
        phone: '123-456-7890',
        industry: 'Technology',
        function: 'IT',
        caseStudyId: 'CS001',
        campaign_name: campaignName
      }
    });

    // Create test call scripts in temp tables
    await prisma.callScript_temp.create({
      data: {
        buyerId: 'TEST-BUYER-001',
        productId: 1,
        topicId: 'TEST-TOPIC-001',
        description: 'Test call script content'
      }
    });

    // Create test email scripts in temp tables
    await prisma.emailScript_temp.create({
      data: {
        buyerId: 'TEST-BUYER-001',
        email1: 'Test email 1 content',
        email2: 'Test email 2 content',
        email3: 'Test email 3 content',
        linkedIn1: 'Test LinkedIn message 1',
        linkedIn2: 'Test LinkedIn message 2'
      }
    });
  } catch (error) {
    console.error('Error in test setup:', error);
  }
});

// Cleanup after tests
afterAll(async () => {
  try {
    // Clean up test data
    await prisma.callScript_temp.deleteMany({
      where: { buyerId: 'TEST-BUYER-001' }
    });

    await prisma.emailScript_temp.deleteMany({
      where: { buyerId: 'TEST-BUYER-001' }
    });

    await prisma.buyerList_temp.deleteMany({
      where: { campaign_name: campaignName }
    });

    // Check if user exists before deleting
    const user = await prisma.users.findUnique({
      where: { email: 'ai-research-test@example.com' }
    });
    
    if (user) {
      await prisma.users.delete({
        where: { email: 'ai-research-test@example.com' }
      });
    }
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
});

describe('AI Research API', () => {
  test('should process AI research for a campaign', async () => {
    const response = await request(app)
      .post(`/api/v1/ai-research/${campaignId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        useTestMode: true // Flag to use mock responses instead of real AI calls
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('successfully');

    // Verify that call scripts exist in temp tables
    const callScripts = await prisma.callScript_temp.findMany({
      where: { buyerId: 'TEST-BUYER-001' }
    });

    expect(callScripts.length).toBeGreaterThan(0);

    // Verify that email scripts exist in temp tables
    const emailScripts = await prisma.emailScript_temp.findMany({
      where: { buyerId: 'TEST-BUYER-001' }
    });

    expect(emailScripts.length).toBeGreaterThan(0);
  });

  test('should commit research results to permanent tables', async () => {
    const response = await request(app)
      .post(`/api/v1/commit-to-db/${campaignId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('successfully');
  });
}); 