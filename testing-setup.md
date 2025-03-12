# Testing Setup Guide

## Environment Setup

### Required Environment Files

1. `.env.test` (Backend):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cl_test"
OPENAI_API_KEY="sk-mock-key-for-testing"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="mock-access-key"
AWS_SECRET_ACCESS_KEY="mock-secret-key"
PORT=4000
NODE_ENV=test
```

2. `cypress.env.json` (Frontend):
```json
{
  "TEST_USER_EMAIL": "test@example.com",
  "TEST_USER_PASSWORD": "TestPassword123!"
}
```

## Mock Data Setup

### Backend Mocks

1. **Prisma Client Mocks**:
```typescript
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
  created_at: new Date()
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
```

2. **AWS Service Mocks**:
```typescript
// S3 Mock
const mockS3 = {
  getSignedUrl: jest.fn(),
  putObject: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({})
  })),
  getObject: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({})
  }))
};

// Amazon Connect Mock
const mockConnect = {
  startOutboundVoiceContact: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({ ContactId: 'test-contact-id' })
  }))
};
```

## Amazon Connect Setup

### Test Environment Configuration

1. **Connect Instance Setup**:
   - Create a test instance in Amazon Connect
   - Configure outbound calling
   - Set up test phone numbers

2. **Required Permissions**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "connect:StartOutboundVoiceContact",
        "connect:StopContact",
        "connect:GetContactAttributes"
      ],
      "Resource": "*"
    }
  ]
}
```

3. **Connect CCP Configuration**:
```javascript
const connectConfig = {
  ccpUrl: 'https://your-connect-instance.awsapps.com/connect/ccp-v2/',
  region: 'us-east-1',
  softphone: {
    allowFramedSoftphone: true
  }
};
```

## Running Tests

### Backend Tests
```bash
# Run all backend tests
npm test

# Run specific test file
npm test tests/feedback-callnote.test.ts
```

### E2E Tests
```bash
# Run all E2E tests
./run-e2e-tests.sh

# Run comprehensive verification
./verify-all-tests.sh
```

### Test Categories

1. **Unit Tests**:
   - Individual component testing
   - Service function testing
   - Utility function testing

2. **Integration Tests**:
   - API endpoint testing
   - Database operations testing
   - Service integration testing

3. **E2E Tests**:
   - User flow testing
   - Feature testing
   - Visual regression testing
   - Accessibility testing
   - Performance testing

## Troubleshooting Tests

### Common Issues

1. **Database Connection**:
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env.test
   - Verify database exists

2. **AWS Mocks**:
   - Check mock implementations
   - Verify AWS credential mocks
   - Check service mocks

3. **Frontend Tests**:
   - Verify Next.js server is running
   - Check Cypress configuration
   - Verify mock data setup

### Test Maintenance

1. **Updating Mock Data**:
   - Keep mock data in sync with schema changes
   - Update API response mocks
   - Maintain realistic test data

2. **Visual Testing**:
   - Update screenshots when UI changes
   - Review visual regression tests
   - Maintain baseline images

3. **Performance Testing**:
   - Update thresholds as needed
   - Monitor test execution times
   - Optimize slow tests 