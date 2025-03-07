#!/bin/bash

# Script to start both frontend and backend servers
# Usage: ./start-app.sh

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting CL Application (Frontend and Backend)${NC}"
echo "=================================================="
echo ""

# Start backend server
echo -e "${YELLOW}Starting backend server...${NC}"
cd cl-backendv4
npm run start:dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 5

# Start frontend server
echo -e "${YELLOW}Starting frontend server...${NC}"
cd ../cl-frontendv4
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"

echo ""
echo -e "${GREEN}Both servers are now running:${NC}"
echo "- Backend: http://localhost:3001"
echo "- Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait for user to press Ctrl+C
wait $BACKEND_PID

# If we get here, the backend has stopped, so stop the frontend too
echo -e "${YELLOW}Shutting down frontend server...${NC}"
kill $FRONTEND_PID

echo -e "${GREEN}All servers have been shut down.${NC}" 