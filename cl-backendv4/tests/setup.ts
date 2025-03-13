import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Mock test data
const mockCampaign = {
  name: 'Test Campaign',
  company_name: 'Test Company',
  company_site: 'https://testcompany.com',
  product_id: 1,
  product_name: 'Test Product',
  product_category: 'Software',
  vertical_1: 'Technology',
  vertical_2: 'SaaS',
  vertical_3: 'B2B',
  active: true,
  created_at: new Date(),
};

const mockBuyer = {
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
  campaign_name: 'Test Campaign'
};

const mockCallScript = {
  buyerId: 'TEST-BUYER-001',
  productId: 1,
  topicId: 'TEST-TOPIC-001',
  description: 'Test call script content',
};

const mockEmailScript = {
  buyer_identifier: 'TEST-BUYER-001',
  email1: 'Test email 1 content',
  email2: 'Test email 2 content',
  email3: 'Test email 3 content',
  linkedIn1: 'Test LinkedIn message 1',
  linkedIn2: 'Test LinkedIn message 2'
};

const mockTopic = {
  title: 'Test Topic',
  category: 'Sales',
  detail: 'Test topic details',
  topic_identifier: 'TEST-TOPIC-001'
};

// Mock Prisma client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $transaction: jest.fn((callback) => callback()),
      users: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn()
      },
      buyer_list: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn().mockResolvedValue(mockBuyer),
        deleteMany: jest.fn()
      },
      call_logs: {
        create: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn()
      },
      callScript_temp: {
        create: jest.fn().mockResolvedValue(mockCallScript),
        findMany: jest.fn().mockResolvedValue([mockCallScript]),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0)
      },
      emailScript_temp: {
        create: jest.fn().mockResolvedValue(mockEmailScript),
        findMany: jest.fn().mockResolvedValue([mockEmailScript]),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0)
      },
      buyerList_temp: {
        create: jest.fn().mockResolvedValue(mockBuyer),
        findMany: jest.fn().mockResolvedValue([mockBuyer]),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0)
      },
      topics_temp: {
        create: jest.fn().mockResolvedValue(mockTopic),
        findMany: jest.fn().mockResolvedValue([mockTopic]),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0)
      },
      campaigns_temp: {
        create: jest.fn().mockResolvedValue(mockCampaign),
        findMany: jest.fn().mockResolvedValue([mockCampaign]),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0)
      },
      call_scripts: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn().mockResolvedValue(mockCallScript),
        deleteMany: jest.fn()
      },
      emailScript: {
        findUnique: jest.fn().mockResolvedValue(mockEmailScript),
        findMany: jest.fn().mockResolvedValue([mockEmailScript]),
        create: jest.fn().mockResolvedValue(mockEmailScript),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 })
      },
      topics: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        deleteMany: jest.fn()
      },
      campaigns: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn().mockResolvedValue(mockCampaign),
        deleteMany: jest.fn()
      },
      feedbacks: {
        create: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
        upsert: jest.fn()
      }
    }))
  };
});

// Mock AWS SDK
jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrl: jest.fn(),
    putObject: jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({})
    })),
    getObject: jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({})
    }))
  })),
  config: {
    update: jest.fn()
  }
}));

// Create a test Prisma client
export const prisma = new PrismaClient();

// Global setup before all tests
beforeAll(async () => {
  // Any setup needed before all tests
  console.log('Setting up test environment...');
});

// Global teardown after all tests
afterAll(async () => {
  // Clean up after all tests
  await prisma.$disconnect();
  console.log('Test environment teardown complete.');
});

// Reset database between tests if needed
afterEach(async () => {
  // Reset all mocks
  jest.clearAllMocks();
}); 