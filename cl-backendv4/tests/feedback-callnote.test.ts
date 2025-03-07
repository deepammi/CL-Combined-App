import request from 'supertest';
import express from 'express';
import prisma from '../src/prisma';
import { FeedbackCallNoteService } from '../src/service/feedback.callnote.service';

// Mock the QueueThrottler to avoid ESM import issues
jest.mock('../src/service/aiQueryClients/QueueThrottler', () => ({
  createThrottledFunction: jest.fn((fn) => fn),
  createRateLimitedFunction: jest.fn((fn) => fn),
  createThrottledQueue: jest.fn(() => ({
    add: jest.fn((fn) => fn()),
  })),
}));

// Mock Prisma client
jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: {
    topics: {
      findMany: jest.fn(),
    },
    feedbacks: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback()),
  },
}));

// Create a mock Express app
const app = express();

// Configure Express app to parse JSON
app.use(express.json());

// Mock route for feedback call notes
app.post('/api/v1/feedback-callnote', function(req, res) {
  FeedbackCallNoteService(req.body)
    .then(result => {
      res.status(200).json({ success: true, message: result });
    })
    .catch(error => {
      res.status(400).json({ success: false, message: error.message || 'An error occurred' });
    });
});

describe('Feedback Call Note Service', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('should successfully process feedback and call notes', async () => {
    // Mock topic data
    const mockTopics = [{ id: 'topic-1', title: 'Introduction' }];
    const mockCallNotesTopics = [{ id: 'topic-2', title: 'call_notes' }];
    
    // Setup mock implementations
    (prisma.topics.findMany as jest.Mock).mockImplementation((args) => {
      if (args.where.title === 'call_notes') {
        return Promise.resolve(mockCallNotesTopics);
      }
      return Promise.resolve(mockTopics);
    });
    
    (prisma.feedbacks.upsert as jest.Mock).mockResolvedValue({
      id: 'feedback-1',
      call_script_id: 1,
      topic_id: 'topic-1',
      section_title: 'Introduction',
      user_email: 'test@example.com',
      comment: 'Y',
      flag: true,
    });
    
    // Test data
    const testData = {
      values: [true],
      titles: ['Introduction'],
      note: 'This is a test note',
      user_email: 'test@example.com',
    };
    
    // Make request to the mock endpoint
    const response = await request(app)
      .post('/api/v1/feedback-callnote')
      .send(testData);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Success');
    
    // Verify prisma calls
    expect(prisma.topics.findMany).toHaveBeenCalledTimes(2);
    expect(prisma.feedbacks.upsert).toHaveBeenCalledTimes(2);
  });
  
  test('should handle missing topics gracefully', async () => {
    // Mock empty topics
    (prisma.topics.findMany as jest.Mock).mockResolvedValue([]);
    
    // Test data
    const testData = {
      values: [true],
      titles: ['NonExistentTopic'],
      note: 'This is a test note',
      user_email: 'test@example.com',
    };
    
    // Make request to the mock endpoint
    const response = await request(app)
      .post('/api/v1/feedback-callnote')
      .send(testData);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Success with warnings: Call notes topic not found');
    
    // Verify prisma calls
    expect(prisma.topics.findMany).toHaveBeenCalledTimes(2);
    expect(prisma.feedbacks.upsert).toHaveBeenCalledTimes(0);
  });
  
  test('should handle database errors', async () => {
    // Mock database error
    (prisma.topics.findMany as jest.Mock).mockRejectedValue(new Error('Database connection error'));
    
    // Test data
    const testData = {
      values: [true],
      titles: ['Introduction'],
      note: 'This is a test note',
      user_email: 'test@example.com',
    };
    
    // Make request to the mock endpoint
    const response = await request(app)
      .post('/api/v1/feedback-callnote')
      .send(testData);
    
    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Database connection error');
  });
}); 