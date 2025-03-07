// Mock AWS services for testing
import AWS from 'aws-sdk';

// Mock S3 service
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

// Mock Bedrock service
const mockBedrockRuntime = {
  invokeModel: jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve({
      body: JSON.stringify({
        completion: 'Mock AI response from Bedrock'
      })
    })
  }))
};

// Mock Amazon Connect service
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

export function mockAWSServices() {
  // Mock AWS SDK
  jest.mock('aws-sdk', () => ({
    S3: jest.fn(() => mockS3),
    Connect: jest.fn(() => mockConnect),
    BedrockRuntime: jest.fn(() => mockBedrockRuntime)
  }));

  // Mock AWS Bedrock client
  jest.mock('@aws-sdk/client-bedrock-runtime', () => ({
    BedrockRuntimeClient: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({
        completion: 'Mock AI response from Bedrock client'
      })
    })),
    InvokeModelCommand: jest.fn()
  }));

  // Mock AWS S3 client
  jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => Promise.resolve('Mock S3 content')
        }
      })
    })),
    GetObjectCommand: jest.fn(),
    ListObjectsV2Command: jest.fn()
  }));

  // Mock S3 presigner
  jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn().mockResolvedValue('https://mock-presigned-url.com/file')
  }));
}

// Export mocks for direct access in tests if needed
export { mockS3, mockBedrockRuntime, mockConnect }; 