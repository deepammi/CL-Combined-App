# CL Application Backend

This is the backend component of the CL application, built with Node.js, Express, and PostgreSQL. It provides API endpoints for the frontend to interact with the database and external services like AWS.

## Related Components

This backend works in conjunction with the frontend component:
- Frontend: Located in the `../cl-frontendv4` directory

For the best development experience, we recommend setting up both the frontend and backend components together. See the [Combined Setup Guide](docs/combined-setup-guide.md) for instructions.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- AWS account with appropriate permissions

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up the database:
   ```bash
   npx prisma migrate deploy
   ```

## Running the Application

Start the backend server:

```bash
npm run start:dev
```

The server will start on http://localhost:3001 by default.

## Testing

Run the backend tests:

```bash
npm test
```

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Combined Setup Guide](docs/combined-setup-guide.md) - How to set up and work with both frontend and backend
- [End-to-End Testing Guide](docs/e2e-testing-readme.md) - Guide for running end-to-end tests
- [Test Verification Document](docs/test-verification-document.md) - Verification that all tests are passing
- [Bug Fixes Verification Guide](docs/bug-fixes-verification-guide.md) - Details of bug fixes and verification
- [Final Project Report](docs/final-report.md) - Comprehensive report of all work completed

## Verification Status

✅ **ALL TESTS PASSED**: All backend tests are passing successfully.

✅ **ALL BUG FIXES VERIFIED**: All identified bugs have been fixed and verified.

✅ **APPLICATION READY FOR RELEASE**: The backend is now ready for release.

Date of Final Verification: March 7, 2025 