# CL Application Documentation

## Application Overview

The CL application is a call management and AI research platform consisting of:

- **Backend**: Node.js with Express, Prisma ORM, and AWS services integration
- **Frontend**: Next.js/React with TypeScript, Ant Design UI components

The application enables users to manage campaigns, make phone calls through Amazon Connect, analyze call data, and leverage AI for research and insights.

## Architecture

### Backend Architecture

1. **API Layer**:
   - Express.js routes and controllers
   - Authentication middleware
   - Request validation

2. **Service Layer**:
   - Business logic implementation
   - AWS service integrations (S3, Bedrock)
   - Data processing and transformation

3. **Data Layer**:
   - Prisma ORM for database interactions
   - PostgreSQL database
   - Temporary and permanent data tables

4. **Utility Layer**:
   - AWS credentials management
   - Error handling utilities
   - Environment configuration

### Frontend Architecture

1. **Page Components**:
   - Next.js pages and routes
   - Authentication and authorization

2. **UI Components**:
   - Reusable React components
   - Ant Design integration
   - Custom UI elements

3. **State Management**:
   - React hooks and context
   - API integration with axios

4. **Utilities**:
   - Error handling
   - Data formatting
   - API retry mechanisms

## Key Features

1. **Campaign Management**:
   - Create and manage campaigns
   - Upload campaign data
   - Track campaign performance

2. **Call Management**:
   - Make calls through Amazon Connect
   - Record and transcribe calls
   - Analyze call data

3. **AI Research**:
   - Generate AI research for campaigns
   - Process and analyze research data
   - Commit research to database

4. **User Authentication**:
   - User registration and login
   - Role-based access control
   - Secure authentication flow

## AWS Integration

The application integrates with several AWS services:

1. **Amazon S3**:
   - Store call recordings
   - Store and retrieve transcripts
   - Manage campaign data files

2. **Amazon Connect**:
   - Make outbound calls
   - Manage call flows
   - Track call metrics

3. **Amazon Bedrock**:
   - AI model integration
   - Natural language processing
   - Research generation

## Recent Improvements

### Backend Improvements

1. **AWS Credential Management**:
   - Centralized credential handling in `src/utils/aws-credentials.ts`
   - Retry mechanisms with exponential backoff
   - Improved error handling

2. **Test Suite Enhancements**:
   - Mock Express apps for isolated testing
   - Improved test data cleanup
   - New test for feedback-callnote service

3. **Database Operations**:
   - Fixed data transfer issues
   - Improved error handling
   - Enhanced cleanup procedures

### Frontend Improvements

1. **UI Enhancements**:
   - Fixed button positioning in `ConnectCCP.jsx`
   - Improved layout and visual hierarchy

2. **API Reliability**:
   - Added retry mechanisms for API calls
   - Implemented proper loading states
   - Enhanced error handling and user feedback

3. **Call History Feature**:
   - Improved S3 URL handling
   - Enhanced error recovery
   - Added fallback mechanisms

## Development Guidelines

### Code Style

1. **TypeScript**:
   - Use strong typing whenever possible
   - Avoid `any` type unless absolutely necessary
   - Define interfaces for complex data structures

2. **Error Handling**:
   - Use try/catch blocks for async operations
   - Provide meaningful error messages
   - Implement retry mechanisms for external services

3. **Testing**:
   - Write tests for new features
   - Use mock Express apps for API tests
   - Ensure proper cleanup after tests

### AWS Integration

1. **Credentials**:
   - Always use the `aws-credentials.ts` utility
   - Never hardcode AWS credentials
   - Use environment variables for configuration

2. **S3 Operations**:
   - Use retry mechanisms for all S3 operations
   - Handle different URL formats with `s3UrlExtractor.ts`
   - Implement proper error handling

3. **Connect Integration**:
   - Use timeout settings for API calls
   - Implement retry mechanisms
   - Provide clear user feedback

### Frontend Development

1. **Component Structure**:
   - Keep components focused on a single responsibility
   - Use composition for complex UIs
   - Extract reusable logic to custom hooks

2. **API Calls**:
   - Use the `retryApiCall` utility for resilience
   - Implement proper loading states
   - Handle errors gracefully with user feedback

3. **UI/UX**:
   - Follow Ant Design patterns
   - Ensure responsive design
   - Provide clear feedback for async operations

## Deployment

### Backend Deployment

1. **Environment Setup**:
   - Configure environment variables
   - Set up AWS credentials
   - Configure database connection

2. **Database Migration**:
   - Run Prisma migrations
   - Seed initial data if needed

3. **Server Start**:
   - Use PM2 or similar for process management
   - Configure logging
   - Set up monitoring

### Frontend Deployment

1. **Build Process**:
   - Configure environment variables
   - Build the Next.js application
   - Optimize assets

2. **Hosting**:
   - Deploy to Vercel, Netlify, or similar
   - Configure CDN
   - Set up custom domain if needed

## Troubleshooting

### Common Issues

1. **AWS Credential Issues**:
   - Check environment variables
   - Verify AWS permissions
   - Use the AWS credentials utility for debugging

2. **Database Connection Issues**:
   - Verify database URL
   - Check Prisma configuration
   - Ensure database migrations are up to date

3. **API Call Failures**:
   - Check network connectivity
   - Verify API endpoints
   - Use retry mechanisms

### Debugging Tools

1. **Backend Logging**:
   - Check server logs
   - Use console.error for critical issues
   - Implement structured logging

2. **Frontend Debugging**:
   - Use browser developer tools
   - Check network requests
   - Monitor state changes

3. **Test Failures**:
   - Run tests in isolation
   - Check for environment issues
   - Verify test data setup and cleanup

## Future Development

### Recommended Improvements

1. **Test Coverage**:
   - Increase overall test coverage
   - Add integration tests
   - Implement end-to-end testing

2. **Code Quality**:
   - Refactor large service files
   - Standardize error handling
   - Improve documentation

3. **Infrastructure**:
   - Set up CI/CD pipeline
   - Implement automated testing
   - Configure staging environment

4. **Features**:
   - Enhance call analytics
   - Improve AI research capabilities
   - Expand campaign management features

## Testing

For detailed information about setting up and running tests, including mock data and credentials, please refer to [Testing Setup Guide](testing-setup.md).

Key testing resources:
- Mock data configuration
- AWS credentials setup
- Test environment configuration
- Troubleshooting guide

## Conclusion

The CL application has been significantly improved in terms of reliability, testability, and user experience. By following the guidelines in this documentation, developers can maintain and extend the application effectively while ensuring high quality and reliability. 