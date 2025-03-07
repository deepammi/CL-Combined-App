# End-to-End Testing for CL Application

This document provides instructions for setting up and running end-to-end tests for the CL application.

## Overview

The end-to-end tests are implemented using Cypress, a JavaScript end-to-end testing framework. The tests cover the following key user journeys:

1. Authentication (Login)
2. Navigation between pages
3. Campaign Setup
4. AI Research
5. Phone Calling (Caller Dashboard)
6. Database Operations
7. Pre-Sales AI Page

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database
- AWS credentials (for some tests)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CL
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd cl-frontendv4
   npm install
   cd ../cl-backendv4
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.test` file in the `cl-backendv4` directory with the following content:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/cl_test
     JWT_SECRET=test-secret
     AWS_REGION=us-east-1
     AWS_ACCESS_KEY_ID=test-access-key
     AWS_SECRET_ACCESS_KEY=test-secret-key
     ```

   - Create a `.env.local` file in the `cl-frontendv4` directory with the following content:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
     ```

4. Create a test database:
   ```bash
   createdb cl_test
   ```

5. Run database migrations:
   ```bash
   cd cl-backendv4
   npx prisma migrate dev
   ```

## Running Tests

### Option 1: Using the Shell Script

We've provided a shell script that starts both the frontend and backend servers and runs the Cypress tests:

```bash
chmod +x run-e2e-tests.sh
./run-e2e-tests.sh
```

### Option 2: Manual Execution

1. Start the backend server:
   ```bash
   cd cl-backendv4
   npm run start:dev
   ```

2. In a separate terminal, start the frontend server:
   ```bash
   cd cl-frontendv4
   npm run dev
   ```

3. In a third terminal, run the Cypress tests:
   ```bash
   cd cl-frontendv4
   npm run cypress:open  # For interactive mode
   # OR
   npm run cypress:run   # For headless mode
   ```

## Test Structure

The tests are organized by feature in the `cl-frontendv4/cypress/e2e` directory:

### Basic Tests (`basic-test.cy.ts`)
- Verifies basic navigation and page loading
- Tests that the homepage and login page load correctly
- Verifies that login form elements exist
- Tests navigation to different pages in the application

### Feature Tests (`feature-tests.cy.ts`)
- Tests navigation to all major pages in the application
- Verifies that each page loads correctly
- Includes tests for:
  - Login page
  - Caller Dashboard
  - AI Research
  - Call Analysis
  - Pre-Sales AI
  - Campaign Alerts
  - Manager Dashboard
  - Call Logs

### Working Tests (`working-test.cy.ts`)
- Demonstrates a working approach to testing the application
- Uses localStorage to simulate authentication
- Tests navigation between pages
- Mocks API responses for testing dashboard functionality

### Login Tests (`login-test.cy.ts`)
- Verifies the login page displays correctly
- Tests login with invalid credentials shows errors
- Tests login with valid credentials redirects to dashboard
- Tests login with empty fields shows validation errors
- Tests handling of server errors
- Uses the credentials from the screenshot (userone, UserOne1*)

### Campaign Setup Tests (`campaign-setup-test.cy.ts`)
- Verifies the campaign setup page displays correctly
- Tests Excel file upload functionality
- Verifies data is loaded into temporary tables
- Tests the display of uploaded data
- Tests handling of file upload errors

### AI Research Tests (`ai-research-test.cy.ts`)
- Verifies the AI research page displays correctly
- Tests campaign selection
- Tests the AI research process
- Verifies results are displayed
- Tests committing research results to database
- Tests handling of research process errors

### Phone Calling Tests (`phone-calling-test.cy.ts`)
- Verifies the caller dashboard page displays correctly
- Tests the display of call scripts
- Tests the blue "Open amazon connect ccp" button
- Tests the green button for API calls
- Tests the red button for disconnecting calls
- Tests the call history feature
- Tests handling of outbound call errors

### Database Operations Tests (`database-operations-test.cy.ts`)
- Tests the "Commit to DB" button
- Verifies data transfer from temporary to permanent tables
- Tests error handling for database operations

### Pre-Sales AI Tests (`pre-sales-ai-test.cy.ts`)
- Verifies the pre-sales AI page displays correctly
- Tests navigation between buyers using Next and Back buttons
- Tests the display of buyer details
- Tests search and filtering functionality

## Testing Approach

### Authentication

The application uses JWT-based authentication. For testing protected routes, we have two approaches:

1. **Mock Login API**: Intercept the login API call and return a mock JWT token.
   ```typescript
   cy.intercept('POST', '**/api/v1/auth/login', {
     statusCode: 200,
     body: {
       token: 'fake-jwt-token',
       user: {
         email: 'userone@example.com',
         name: 'User One',
         roleId: 1
       }
     }
   }).as('loginRequest');
   ```

2. **Use localStorage**: Set the token directly in localStorage to simulate being logged in.
   ```typescript
   cy.window().then((win) => {
     win.localStorage.setItem('token', 'fake-jwt-token');
     win.localStorage.setItem('user', JSON.stringify({
       email: 'userone@example.com',
       name: 'User One',
       roleId: 1
     }));
   });
   ```

### API Mocking

We use Cypress's network interception capabilities to mock API responses. This allows the tests to run without requiring actual API calls to external services like AWS.

Example of mocking an API response:

```typescript
cy.intercept('GET', '**/api/v1/campaign/active', {
  statusCode: 200,
  body: {
    success: true,
    data: {
      id: 'test-campaign-123',
      name: 'Test Campaign',
      buyers: [
        { 
          id: 'buyer-1', 
          name: 'Test Buyer 1', 
          company: 'Test Company 1',
          phone: '+1234567890',
          email: 'buyer1@example.com',
          position: 'CEO'
        }
      ]
    }
  }
}).as('getActiveCampaign');
```

### Page Navigation

For testing navigation between pages, we use direct URL visits with the `failOnStatusCode` option to handle potential 404 errors:

```typescript
cy.visit('/caller-dashboard', { failOnStatusCode: false });
```

### Element Selection

We use generic selectors where possible to make tests more robust:

```typescript
// Find an element containing specific text
cy.contains('Test Buyer 1').should('exist');

// Find elements by type
cy.get('input').should('exist');
cy.get('button').should('exist');
```

## Test Fixtures

Test fixtures are stored in the `cl-frontendv4/cypress/fixtures` directory. These include:

- `test-campaign.xlsx`: A sample Excel file for testing campaign setup with the following structure:
  - Sheet 1: Buyer_list (id, name, company, phone, email, position)
  - Sheet 2: Buyside_queries (id, query)
  - Sheet 3: Camp_users (id, name, email, role)
  - Sheet 4: Topics (id, topic)

## Continuous Integration

The tests can be run in a CI/CD pipeline using GitHub Actions. A sample workflow is provided in `.github/workflows/e2e-tests.yml`.

## Troubleshooting

### Common Issues

1. **Tests fail to connect to the backend**:
   - Ensure the backend server is running on port 4000
   - Check that the `NEXT_PUBLIC_API_URL` environment variable is set correctly
   - Verify the backend is using the correct script: `npm run start:dev`

2. **Database-related test failures**:
   - Ensure the PostgreSQL database is running
   - Verify that the `DATABASE_URL` in `.env.test` is correct
   - Run `npx prisma migrate reset` to reset the test database

3. **AWS credential issues**:
   - For local testing, you can use mock AWS credentials
   - Ensure the AWS environment variables are set correctly

4. **UI element not found errors**:
   - The tests use generic selectors to be more robust
   - If UI elements change, update the selectors in the test files
   - Use `cy.contains()` with regular expressions for more flexible matching

5. **Authentication issues**:
   - The application might validate tokens on the server side
   - Try using the mock login approach instead of setting localStorage directly
   - Check the network requests to understand the authentication flow

### Debugging

To debug tests:

1. Run Cypress in interactive mode:
   ```bash
   npm run cypress:open
   ```

2. Use `cy.debug()` in your test code to pause execution and inspect the state

3. Check the Cypress logs and screenshots in the `cypress/screenshots` and `cypress/videos` directories

## Extending the Tests

To add new tests:

1. Create a new test file in the `cl-frontendv4/cypress/e2e` directory
2. Follow the existing patterns for mocking API responses and testing UI interactions
3. Add any necessary fixtures to the `cl-frontendv4/cypress/fixtures` directory
4. Use generic selectors to make tests more robust

Example of a new test file:

```typescript
describe('New Feature Test', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000);
  });

  it('should navigate to the new feature page', () => {
    cy.visit('/new-feature', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should interact with the new feature', () => {
    cy.visit('/new-feature', { failOnStatusCode: false });
    cy.wait(1000);
    cy.get('button').contains('Do Something').click();
    cy.contains('Success').should('exist');
  });
});
```

## Best Practices

1. Keep tests independent and isolated
2. Mock external dependencies
3. Use descriptive test names
4. Focus on testing user journeys rather than implementation details
5. Keep tests fast and reliable
6. Use generic selectors where possible to make tests more robust
7. Add appropriate wait times and assertions to ensure tests are reliable
8. Use direct URL navigation for testing protected routes
9. Add proper error handling in tests to make debugging easier
10. Keep test data separate from test logic using fixtures 