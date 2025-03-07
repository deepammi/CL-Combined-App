# End-to-End Testing and Validation Plan

## Overview
This document outlines the comprehensive testing strategy for the CL application, which consists of a Node.js backend and a TypeScript/React frontend. The goal is to create automated test routines that validate all features and fix known bugs.

## Test Environment Setup

### Backend Testing Setup
1. Create a test database configuration
2. Set up Jest/Mocha for backend testing
3. Configure environment variables for testing

### Frontend Testing Setup
1. Set up Cypress for E2E testing
2. Configure React Testing Library for component testing
3. Set up mock services for API calls

## Feature Testing Matrix

### 1. Authentication and User Management
- [ ] Initial Login functionality
- [ ] Create New Login functionality
- [ ] Role-based access control (Admin vs. Regular users)

### 2. Campaign Setup
- [ ] Campaign Setup menu functionality
- [ ] Excel file upload and processing
- [ ] Verification of data loading into temp tables

### 3. AI Research
- [ ] AI Research menu functionality
- [ ] Excel sheet processing
- [ ] Verification of data loading from "Buyer_list" tab to Buyer_list_temp table
- [ ] Verification of data loading from "Buyside_queries" tab to Topics_temp table
- [ ] AI query execution (Perplexity.ai, Bedrock API, OpenAI API)
- [ ] Verification of research results in Call_script_temp and Emails_temp tables

### 4. Database Commit
- [ ] "Commit To DB" button functionality
- [ ] Data transfer from temp tables to permanent tables
- [ ] Verification of data integrity after transfer

### 5. Profiles AI Page
- [ ] Navigation and display of buyer details
- [ ] Next and Back arrow functionality
- [ ] Profile details visibility

### 6. Call Script Section
- [ ] Display of query responses in accordion section
- [ ] Visibility of text when clicking the plus sign

### 7. Feedback Recording
- [ ] Feedback recording functionality
- [ ] Storage in Feedback table

### 8. Phone Calling Section
- [ ] Blue "Open amazon connect" button functionality
- [ ] Login window with credentials
- [ ] Green Button for API call to Amazon Connect
- [ ] Call connection to browser window
- [ ] Red button for call disconnection

### 9. Email Script Section
- [ ] Display of 5 columns from Email_Script table
- [ ] Proper functioning of Edit/Save option

### 10. Call History Section
- [ ] Fetch Call History button functionality
- [ ] Display of call records from S3 bucket
- [ ] Fetch Call Details button functionality
- [ ] Display of call transcripts

### 11. Free Form Notes
- [ ] Entry of free form text
- [ ] Saving to Feedback table

### 12. ChatGPT Integration
- [ ] Ask Product/Services Question functionality
- [ ] Ask Anything functionality
- [ ] Display of ChatGPT responses

## Known Bugs to Fix

1. **UI Issue**: Blue button should be above the phone buttons, not among them
2. **Functionality Issue**: Green Button for API call is unreliable - works sometimes but not always
3. **Database Issue**: Data is not getting transferred properly to permanent tables
4. **AWS Credentials Issue**: AWS credentials not loading properly from .env file
5. **Call History Feature**: Not working due to access credential issues

## Test Automation Implementation

### Backend Test Suite
```typescript
// Example structure for backend tests
describe('Authentication API', () => {
  test('should authenticate valid user', async () => {
    // Test implementation
  });
  
  test('should reject invalid credentials', async () => {
    // Test implementation
  });
});

describe('Campaign API', () => {
  test('should process Excel file correctly', async () => {
    // Test implementation
  });
  
  // More tests...
});
```

### Frontend Test Suite
```typescript
// Example structure for frontend tests
describe('Login Page', () => {
  test('should display login form', () => {
    // Test implementation
  });
  
  test('should navigate to dashboard after successful login', () => {
    // Test implementation
  });
});

describe('AI Research Page', () => {
  test('should upload Excel file', () => {
    // Test implementation
  });
  
  // More tests...
});
```

## Test Execution Plan

1. Set up CI/CD pipeline for automated testing
2. Run backend tests first to ensure API functionality
3. Run frontend tests to validate UI components
4. Run end-to-end tests to validate complete user flows
5. Generate test reports for review

## Bug Fixing Strategy

1. Prioritize bugs based on severity and impact
2. Fix AWS credential loading issue first
3. Address database transfer issues
4. Fix UI positioning of the blue button
5. Investigate and fix the unreliable Green Button API call

## Deliverables

1. Automated test suite covering all features
2. Fixed bugs as identified in the requirements
3. Test reports documenting test coverage and results
4. Documentation for running tests and maintaining the test suite 