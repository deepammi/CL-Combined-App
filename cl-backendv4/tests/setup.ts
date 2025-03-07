import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

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
  // Clean up after each test if needed
}); 