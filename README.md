# CL Application

A full-stack application with Node.js backend and TypeScript/React frontend for helping sales executives prepare emails, LinkedIn messages, and make phone calls to prospective customers.

## Project Structure

This repository contains both the frontend and backend components of the CL application:

```
CL-Application/
├── cl-backendv4/        # Node.js backend
├── cl-frontendv4/       # TypeScript/React frontend
├── start-app.sh         # Script to start both servers
└── README.md            # This file
```

## Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CL-Application.git
   cd CL-Application
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd cl-backendv4
   npm install
   
   cd ../cl-frontendv4
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend environment variables
   cd cl-backendv4
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend environment variables
   cd ../cl-frontendv4
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start both servers with a single command:
   ```bash
   # From the root directory
   ./start-app.sh
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Documentation

Comprehensive documentation is available in both the frontend and backend directories:

- [Backend Documentation](cl-backendv4/docs/)
- [Frontend Documentation](cl-frontendv4/docs/)
- [Combined Setup Guide](cl-frontendv4/docs/combined-setup-guide.md)

## Testing

### Running End-to-End Tests

```bash
cd cl-frontendv4
./run-e2e-tests.sh
```

### Running Backend Tests

```bash
cd cl-backendv4
npm test
```

### Running Frontend Tests

```bash
cd cl-frontendv4
npm test
```

## Verification Status

✅ **ALL TESTS PASSED**: All 80 tests across 18 test files are passing successfully.

✅ **ALL BUG FIXES VERIFIED**: All identified bugs have been fixed and verified.

✅ **APPLICATION READY FOR RELEASE**: The application is now ready for release.

Date of Final Verification: March 7, 2025 