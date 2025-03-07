# End-to-End Testing Plan for CL Application

## Overview
This document outlines the end-to-end testing strategy for the CL application, which consists of a React/TypeScript frontend and a Node.js backend. The tests will validate the complete user journey from login to campaign setup, AI research, phone calling, and database operations.

## Testing Framework
- **Cypress**: For frontend and integration testing
- **Jest**: For backend unit testing
- **Supertest**: For API testing

## Test Environment Setup
1. **Local Development Environment**:
   - Frontend running on `http://localhost:3000`
   - Backend running on `http://localhost:4000`
   - PostgreSQL database running locally or in a Docker container

2. **Test Data**:
   - Sample Excel files for campaign setup
   - Mock user credentials
   - Mock AWS credentials

## Critical User Journeys to Test

### 1. Authentication Flow
- Login with valid credentials
- Login with invalid credentials
- Create new login
- Password reset flow

### 2. Campaign Setup
- Upload Excel file
- Verify data loading into temporary tables
- Validate UI elements and data display

### 3. AI Research
- Navigate to AI Research page
- Process the same Excel sheet from Campaign Setup
- Verify AI queries are executed
- Verify results are stored in temporary tables
- Test with mock AI responses

### 4. Phone Calling
- Navigate to Phone Calling section
- Test blue button for Amazon Connect CCP
- Test green button for API calls
- Test call disconnection
- Verify call script display
- Test feedback recording

### 5. Email Scripts
- Verify email script display
- Test Edit/Save functionality

### 6. Call History
- Test Fetch Call History functionality
- Test Fetch Call Details functionality
- Verify proper display of call records

### 7. Database Operations
- Test "Commit to DB" functionality
- Verify data transfer from temporary to permanent tables

### 8. Pre-Sales AI Page
- Test navigation between buyers
- Verify buyer details display

## Test Implementation Strategy

### Phase 1: Setup and Authentication Tests
- Configure Cypress for end-to-end testing
- Implement login and authentication tests
- Set up test data and mocks

### Phase 2: Campaign Setup and AI Research Tests
- Implement tests for Excel file upload
- Test data loading and validation
- Test AI research workflow

### Phase 3: Phone Calling and Call History Tests
- Test phone calling functionality
- Test call history retrieval
- Test feedback recording

### Phase 4: Database and Integration Tests
- Test database operations
- Test end-to-end workflows
- Verify data integrity

## Test Execution

### Local Execution
```bash
# Run frontend tests
cd cl-frontendv4
npm run cypress:open  # For interactive mode
npm run cypress:run   # For headless mode

# Run backend tests
cd cl-backendv4
npm test
```

### CI/CD Integration
- Configure GitHub Actions to run tests on pull requests
- Set up test reporting and notifications

## Test Reporting
- Generate HTML reports for test results
- Capture screenshots and videos of test failures
- Track test coverage metrics

## Maintenance Strategy
- Regular updates to test cases as features evolve
- Periodic review of test coverage
- Refactoring of tests to improve reliability and performance 