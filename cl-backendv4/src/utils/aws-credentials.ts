import dotenv from 'dotenv';
import { isDev } from './environment';

// Load environment variables based on the current environment
const loadEnvVariables = () => {
  const env = process.env.NODE_ENV || 'development';
  dotenv.config({ path: `.env.${env}` });
};

// Initialize environment variables
loadEnvVariables();

// Cache for credentials to avoid reading from env files repeatedly
let cachedCredentials: {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3Bucket: string;
  callsBucket: string;
} | null = null;

/**
 * Get AWS credentials with proper error handling
 * @param forceRefresh Force refresh the credentials from env files
 * @returns AWS credentials object
 */
export const getAWSCredentials = (forceRefresh = false) => {
  // Return cached credentials if available and not forcing refresh
  if (cachedCredentials && !forceRefresh) {
    return cachedCredentials;
  }

  // Reload environment variables to ensure we have the latest
  loadEnvVariables();

  const accessKeyId = process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const s3Bucket = process.env.AWS_S3_BUCKET;
  const callsBucket = process.env.AWS_S3_CALLS_BUCKET;

  // Validate credentials
  if (!accessKeyId) {
    throw new Error('AWS Access Key ID is missing. Check your environment variables.');
  }

  if (!secretAccessKey) {
    throw new Error('AWS Secret Access Key is missing. Check your environment variables.');
  }

  if (!region) {
    throw new Error('AWS Region is missing. Check your environment variables.');
  }

  // Cache the credentials
  cachedCredentials = {
    accessKeyId,
    secretAccessKey,
    region,
    s3Bucket: s3Bucket || '',
    callsBucket: callsBucket || '',
  };

  return cachedCredentials;
};

/**
 * Get AWS configuration for S3 client
 * @returns AWS S3 configuration object
 */
export const getAWSS3Config = () => {
  const credentials = getAWSCredentials();
  
  return {
    region: credentials.region,
    endpoint: isDev() ? process.env.LOCALSTACK_ENDPOINT : undefined,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  };
};

/**
 * Get AWS configuration for Bedrock client
 * @returns AWS Bedrock configuration object
 */
export const getAWSBedrockConfig = () => {
  const credentials = getAWSCredentials();
  
  return {
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  };
};

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @returns Result of the function
 */
export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries > maxRetries) {
        throw error;
      }

      console.warn(`Retry ${retries}/${maxRetries} after ${delay}ms due to error:`, error);
      
      // Wait for the delay period
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff
      delay *= 2;
      
      // Refresh credentials before retry
      getAWSCredentials(true);
    }
  }
}; 