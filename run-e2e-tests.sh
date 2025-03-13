#!/bin/bash

# Script to run end-to-end tests for the CL application
# This script starts both the backend and frontend servers, runs the tests, and then shuts down the servers

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the absolute path of the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${YELLOW}Starting CL Application End-to-End Tests${NC}"
echo "=================================================="
echo ""

# Start the backend server
echo -e "${YELLOW}Starting backend server...${NC}"
cd "$SCRIPT_DIR/cl-backendv4" && npm run start:dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 10

# Start the frontend server
echo -e "${YELLOW}Starting frontend server...${NC}"
cd "$SCRIPT_DIR/cl-frontendv4" && npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"

# Wait for frontend to initialize
echo "Waiting for frontend to initialize..."
sleep 10

# Run Cypress tests
echo -e "${YELLOW}Running Cypress tests...${NC}"
cd "$SCRIPT_DIR/cl-frontendv4" && npx cypress run
TEST_EXIT_CODE=$?

# Shutdown servers
echo -e "${YELLOW}Shutting down servers...${NC}"
kill $BACKEND_PID
kill $FRONTEND_PID

# Wait for servers to shut down
sleep 5

# Return to root directory
cd "$SCRIPT_DIR"

# Check test results
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Please check the logs for details.${NC}"
  exit 1
fi 