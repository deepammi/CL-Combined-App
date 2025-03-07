#!/bin/bash

# Exit on error
set -e

# Function to cleanup processes on exit
cleanup() {
  echo "Cleaning up..."
  if [ ! -z "$BACKEND_PID" ]; then
    echo "Shutting down backend server (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || true
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    echo "Shutting down frontend server (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  exit $EXIT_CODE
}

# Set up trap to call cleanup function on exit
trap cleanup EXIT INT TERM

# Parse command line arguments
SPEC_PATTERN=""
if [ "$1" = "--spec" ] && [ ! -z "$2" ]; then
  SPEC_PATTERN="--spec \"$2\""
  echo "Running specific tests: $SPEC_PATTERN"
fi

# Start the backend server
echo "Starting backend server..."
cd ../cl-backendv4
npm run start:dev &
BACKEND_PID=$!

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 5

# Check if backend server is running
if ! ps -p $BACKEND_PID > /dev/null; then
  echo "Error: Backend server failed to start"
  exit 1
fi

# Start the frontend server
echo "Starting frontend server..."
cd ../cl-frontendv4
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to initialize
echo "Waiting for frontend to initialize..."
sleep 10

# Check if frontend server is running
if ! ps -p $FRONTEND_PID > /dev/null; then
  echo "Error: Frontend server failed to start"
  exit 1
fi

# Run Cypress tests
echo "Running Cypress tests..."
if [ -z "$SPEC_PATTERN" ]; then
  npm run cypress:run
else
  eval "npm run cypress:run -- $SPEC_PATTERN"
fi

# Capture the exit code
EXIT_CODE=$?

# Exit with the Cypress exit code
exit $EXIT_CODE 