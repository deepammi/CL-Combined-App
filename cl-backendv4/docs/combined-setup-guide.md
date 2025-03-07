# Working with CL Frontend and Backend Together

This guide explains how to set up and work with both the frontend and backend in a single workspace for the best development experience.

## Why Use a Combined Setup?

Working with both frontend and backend in a single workspace offers several advantages:

- Simplified development workflow
- Easier end-to-end testing
- Better context for implementing features
- Streamlined environment setup
- Coordinated changes across frontend and backend

## Setup Instructions

1. **Create a parent directory for both repositories**:
   ```bash
   mkdir CL-Application
   cd CL-Application
   ```

2. **Clone or copy both repositories**:
   ```bash
   # If using git
   git clone [frontend-repo-url] cl-frontendv4
   git clone [backend-repo-url] cl-backendv4
   
   # Or copy existing directories
   cp -r /path/to/frontend cl-frontendv4
   cp -r /path/to/backend cl-backendv4
   ```

3. **Install dependencies for both**:
   ```bash
   cd cl-backendv4
   npm install
   
   cd ../cl-frontendv4
   npm install
   ```

4. **Create a simple script to start both servers**:
   Create a file named `start-app.sh` in the parent directory:
   ```bash
   #!/bin/bash
   
   # Start backend
   cd cl-backendv4
   npm run start:dev &
   BACKEND_PID=$!
   
   # Wait for backend to initialize
   echo "Waiting for backend to initialize..."
   sleep 5
   
   # Start frontend
   cd ../cl-frontendv4
   npm run dev &
   FRONTEND_PID=$!
   
   # Wait for user to press Ctrl+C
   echo "Both servers are running. Press Ctrl+C to stop both."
   wait $BACKEND_PID
   
   # If we get here, the backend has stopped, so stop the frontend too
   kill $FRONTEND_PID
   ```

5. **Make the script executable**:
   ```bash
   chmod +x start-app.sh
   ```

6. **Start both servers with a single command**:
   ```bash
   ./start-app.sh
   ```

## Running End-to-End Tests

The end-to-end tests are designed to work with a running backend. You can use the provided `run-e2e-tests.sh` script in the frontend directory to start both servers, run the tests, and shut down the servers.

```bash
cd cl-frontendv4
./run-e2e-tests.sh
```

## Development Workflow

When making changes to both parts of the application:

1. Keep separate git histories for each part (if using version control)
2. Make commits to each part separately
3. Push changes to each repository separately (if using remote repositories)

This approach gives you the convenience of working with both codebases together while maintaining their separation for version control purposes.

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=3001
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### Backend and Frontend Connection Issues

If the frontend cannot connect to the backend:

1. Ensure the backend is running on port 3001
2. Check that the `NEXT_PUBLIC_API_URL` in the frontend `.env.local` file is set correctly
3. Verify that CORS is properly configured in the backend

### Database Connection Issues

If the backend cannot connect to the database:

1. Ensure PostgreSQL is running
2. Verify the `DATABASE_URL` in the backend `.env` file is correct
3. Check that the database exists and the user has the necessary permissions

### AWS Credential Issues

If AWS services are not working:

1. Verify that the AWS credentials in the backend `.env` file are correct
2. Ensure the AWS region is set correctly
3. Check that the AWS services being used are available in the specified region 