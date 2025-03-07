# CL Application Frontend

This is the frontend component of the CL application, built with TypeScript, React, and Next.js. It provides a user interface for interacting with the backend services.

## Related Components

This frontend works in conjunction with the backend component:
- Backend: Located in the `../cl-backendv4` directory

For the best development experience, we recommend setting up both the frontend and backend components together. See the [Combined Setup Guide](docs/combined-setup-guide.md) for instructions.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (for full functionality)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

## Running the Application

Start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000 by default.

## Testing

### Running Component Tests

```bash
npm test
```

### Running End-to-End Tests

The end-to-end tests require the backend server to be running. You can use the provided script to start both servers, run the tests, and shut down the servers:

```bash
./run-e2e-tests.sh
```

Or run the tests manually:

```bash
npx cypress run
```

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Combined Setup Guide](docs/combined-setup-guide.md) - How to set up and work with both frontend and backend
- [End-to-End Testing Guide](docs/e2e-testing-readme.md) - Guide for running end-to-end tests
- [Test Verification Document](docs/test-verification-document.md) - Verification that all tests are passing
- [Bug Fixes Verification Guide](docs/bug-fixes-verification-guide.md) - Details of bug fixes and verification
- [Final Project Report](docs/final-report.md) - Comprehensive report of all work completed

## End-to-End Testing Framework

The frontend includes a comprehensive end-to-end testing framework using Cypress. The framework includes:

- 80 tests across 18 test files
- Tests for all critical user journeys
- Performance, accessibility, and visual regression testing
- API mocking for reliable test execution

## Verification Status

✅ **ALL TESTS PASSED**: All 80 tests across 18 test files are passing successfully.

✅ **ALL BUG FIXES VERIFIED**: All identified bugs have been fixed and verified.

✅ **APPLICATION READY FOR RELEASE**: The frontend is now ready for release.

Date of Final Verification: March 7, 2025
