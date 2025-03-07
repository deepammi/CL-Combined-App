import { getAWSCredentials, getAWSS3Config, getAWSBedrockConfig, retryWithExponentialBackoff } from '../../src/utils/aws-credentials';

// Mock environment variables
process.env.AWS_ACCESS_KEY = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_S3_BUCKET = 'test-bucket';
process.env.AWS_S3_CALLS_BUCKET = 'test-calls-bucket';

describe('AWS Credentials Utility', () => {
  test('should get AWS credentials', () => {
    const credentials = getAWSCredentials();
    
    expect(credentials).toEqual({
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
      region: 'us-east-1',
      s3Bucket: 'test-bucket',
      callsBucket: 'test-calls-bucket',
    });
  });

  test('should get AWS S3 config', () => {
    const config = getAWSS3Config();
    
    expect(config).toEqual({
      region: 'us-east-1',
      endpoint: undefined,
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    });
  });

  test('should get AWS Bedrock config', () => {
    const config = getAWSBedrockConfig();
    
    expect(config).toEqual({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    });
  });

  test('should retry with exponential backoff', async () => {
    // Mock function that fails twice and succeeds on the third try
    let attempts = 0;
    const mockFn = jest.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Test error');
      }
      return 'success';
    });

    const result = await retryWithExponentialBackoff(mockFn, 3, 10);
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('should throw error after max retries', async () => {
    // Mock function that always fails
    const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(retryWithExponentialBackoff(mockFn, 2, 10)).rejects.toThrow('Test error');
    expect(mockFn).toHaveBeenCalledTimes(3); // Initial attempt + 2 retries
  });
}); 