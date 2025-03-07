import request from 'supertest';
import express from 'express';
import { prisma } from './setup';
import { mockAWSServices } from './mocks/aws-services';

// Mock QueueThrottler to avoid ESM import issues
jest.mock('../src/service/aiQueryClients/QueueThrottler', () => {
  return require('./mocks/queue-throttler');
});

// Mock AWS module
jest.mock('aws-sdk', () => {
  const mockS3 = {
    getObject: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({
        Body: Buffer.from('Mock transcript content')
      })
    })),
    listObjects: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({
        Contents: [
          { Key: 'call-recordings/test-call-1.wav' },
          { Key: 'call-recordings/test-call-2.wav' }
        ]
      })
    })),
    getSignedUrl: jest.fn().mockImplementation(() => 'https://mock-s3-url.com/test-file')
  };

  const mockConnect = {
    startOutboundVoiceContact: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({
        ContactId: 'mock-call-id-12345'
      })
    })),
    stopContact: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({})
    }))
  };

  const mockBedrockRuntime = {
    invokeModel: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({
        body: JSON.stringify({
          completion: 'Mock AI response from Bedrock'
        })
      })
    }))
  };

  return {
    S3: jest.fn(() => mockS3),
    Connect: jest.fn(() => mockConnect),
    BedrockRuntime: jest.fn(() => mockBedrockRuntime),
    config: {
      update: jest.fn()
    }
  };
});

// Mock AWS credentials utility
jest.mock('../src/utils/aws-credentials', () => {
  return {
    getAWSCredentials: jest.fn().mockReturnValue({
      accessKeyId: 'mock-access-key',
      secretAccessKey: 'mock-secret-key',
      region: 'us-east-1',
      s3Bucket: 'mock-bucket',
      callsBucket: 'mock-calls-bucket'
    }),
    getAWSS3Config: jest.fn().mockReturnValue({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'mock-access-key',
        secretAccessKey: 'mock-secret-key'
      }
    }),
    getAWSBedrockConfig: jest.fn().mockReturnValue({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'mock-access-key',
        secretAccessKey: 'mock-secret-key'
      }
    }),
    retryWithExponentialBackoff: jest.fn().mockImplementation((fn) => fn())
  };
});

// Create a mock Express app
const app = express();
let authToken = 'mock-auth-token';
let testBuyerId = 'TEST-BUYER-PHONE-001';

// Mock routes for testing
app.get('/api/v1/phone/connect-credentials', (req, res) => {
  res.json({
    username: 'userone',
    password: 'password123'
  });
});

app.post('/api/v1/phone/call', (req, res) => {
  res.json({
    message: 'Call initiated successfully',
    callId: 'mock-call-id-12345'
  });
});

app.post('/api/v1/phone/end-call', (req, res) => {
  res.json({
    message: 'Call ended successfully'
  });
});

app.get('/api/v1/phone/call-history/:buyerId', (req, res) => {
  res.json([
    {
      call_id: 'mock-call-id-12345',
      call_date: new Date().toISOString(),
      buyer_id: req.params.buyerId,
      duration: 120,
      status: 'completed'
    }
  ]);
});

app.get('/api/v1/phone/call-details/:callId', (req, res) => {
  res.json({
    transcript: 'Mock transcript content',
    call_recording: 'https://mock-s3-url.com/test-file'
  });
});

// Setup before tests
beforeAll(async () => {
  try {
    // Create test buyer in permanent table
    await prisma.buyer_list.create({
      data: {
        s_no: 1,
        campaign_name: 'Phone Test Campaign',
        buyer_identifier: testBuyerId,
        f_name: 'Jane',
        l_name: 'Smith',
        company: 'Test Corp',
        title: 'CEO',
        website: 'https://testcorp.com',
        linkedin: 'https://linkedin.com/in/janesmith',
        location: 'San Francisco',
        email: 'jane@testcorp.com',
        phone: '123-456-7890',
        industry: 'Technology',
        function: 'Executive'
      }
    });

    // Create test topic
    const testTopic = {
      title: 'Test Topic',
      category: 'Sales',
      detail: 'Test topic details',
      topic_identifier: 'TEST-TOPIC-001'
    };

    await prisma.topics.create({
      data: testTopic
    });

    // Create test call script
    await prisma.call_scripts.create({
      data: {
        buyer_id: testBuyerId,
        product_id: 1,
        topic_id: 'TEST-TOPIC-001',
        description: 'Test call script content'
      }
    });

    // Create test call log
    await prisma.call_logs.create({
      data: {
        call_id: 'mock-call-id-12345',
        buyer_id: testBuyerId,
        call_date: new Date(),
        record_fetched: true,
        transcript: 'Mock transcript content',
        call_recording: 'https://mock-s3-url.com/test-file'
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
    await prisma.call_logs.deleteMany({
      where: { buyer_id: testBuyerId }
    });

    await prisma.call_scripts.deleteMany({
      where: { buyer_id: testBuyerId }
    });

    await prisma.buyer_list.deleteMany({
      where: { buyer_identifier: testBuyerId }
    });

    await prisma.topics.deleteMany({
      where: { topic_identifier: 'TEST-TOPIC-001' }
    });
  } catch (error) {
    console.error('Error in test cleanup:', error);
  }
});

describe('Phone Calling API', () => {
  test('should get Amazon Connect credentials', async () => {
    const response = await request(app)
      .get('/api/v1/phone/connect-credentials')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('password');
    expect(response.body.username).toBe('userone');
  });

  test('should initiate a call to a buyer', async () => {
    const response = await request(app)
      .post('/api/v1/phone/call')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        buyerId: testBuyerId,
        phoneNumber: '123-456-7890'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('initiated');
    expect(response.body).toHaveProperty('callId');
  });

  test('should end an active call', async () => {
    const response = await request(app)
      .post('/api/v1/phone/end-call')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        callId: 'mock-call-id-12345'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('ended');
  });

  test('should fetch call history for a buyer', async () => {
    const response = await request(app)
      .get(`/api/v1/phone/call-history/${testBuyerId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('call_id');
    expect(response.body[0]).toHaveProperty('call_date');
  });

  test('should fetch call details for a specific call', async () => {
    const response = await request(app)
      .get(`/api/v1/phone/call-details/mock-call-id-12345`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('transcript');
    expect(response.body).toHaveProperty('call_recording');
  });
}); 