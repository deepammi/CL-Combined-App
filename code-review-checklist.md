# Code Review Checklist for CL Application

This checklist provides guidelines for reviewing code changes in the CL application. It helps ensure that all code meets the project's quality standards before being merged.

## General

- [ ] Code follows the project's style guide and conventions
- [ ] No commented-out code unless it serves a specific purpose (with explanation)
- [ ] No debugging code (e.g., console.log) left in production code
- [ ] Code is DRY (Don't Repeat Yourself) - no unnecessary duplication
- [ ] Functions and methods are focused and not too long (< 50 lines preferred)
- [ ] Variable and function names are descriptive and follow naming conventions
- [ ] Code is properly formatted (indentation, line length, etc.)
- [ ] No hardcoded values that should be configuration or environment variables
- [ ] Proper error handling is implemented

## TypeScript/JavaScript

- [ ] TypeScript types are properly defined and used
- [ ] No use of `any` type unless absolutely necessary (with justification)
- [ ] Interfaces and types are defined for complex data structures
- [ ] No unused variables or imports
- [ ] Proper null/undefined checks are in place
- [ ] Async/await or Promises are used correctly
- [ ] No memory leaks (e.g., event listeners are properly removed)
- [ ] No use of deprecated APIs or methods

## React/Frontend

- [ ] Components follow single responsibility principle
- [ ] Props are properly typed with TypeScript
- [ ] No prop drilling (consider context or state management)
- [ ] UI is responsive and follows design guidelines
- [ ] Proper loading states are implemented for async operations
- [ ] Error states are handled and displayed to the user
- [ ] No direct DOM manipulation (use React refs if needed)
- [ ] Keys are used correctly in lists
- [ ] Forms have proper validation
- [ ] Accessibility considerations are addressed (ARIA attributes, semantic HTML)

## Backend/API

- [ ] API endpoints follow RESTful conventions
- [ ] Request validation is implemented
- [ ] Proper HTTP status codes are used
- [ ] Error responses are consistent and informative
- [ ] Database queries are optimized
- [ ] Transactions are used where appropriate
- [ ] Authentication and authorization checks are in place
- [ ] Rate limiting or throttling is implemented where needed
- [ ] Sensitive data is not exposed in responses

## AWS Integration

- [ ] AWS credentials are handled securely (using aws-credentials.ts utility)
- [ ] Retry mechanisms are implemented for AWS operations
- [ ] Error handling is comprehensive for AWS service calls
- [ ] S3 operations use the proper URL format handling
- [ ] Timeouts are set for AWS API calls
- [ ] AWS resources are properly cleaned up after use

## Security

- [ ] No security vulnerabilities (SQL injection, XSS, CSRF, etc.)
- [ ] Authentication and authorization are properly implemented
- [ ] Sensitive data is not logged or exposed
- [ ] Input validation is thorough
- [ ] No hardcoded credentials or secrets
- [ ] HTTPS is enforced for all API calls
- [ ] Proper CORS configuration is in place

## Testing

- [ ] Unit tests are included for new functionality
- [ ] Tests cover both success and error cases
- [ ] Mocks are used appropriately for external dependencies
- [ ] Test data is properly set up and cleaned up
- [ ] Tests are isolated and don't depend on each other
- [ ] Edge cases are tested
- [ ] Test coverage is maintained or improved

## Performance

- [ ] No unnecessary API calls or database queries
- [ ] Expensive operations are optimized
- [ ] Proper caching strategies are implemented
- [ ] Large data sets are paginated
- [ ] Frontend renders efficiently (no unnecessary re-renders)
- [ ] Assets are optimized (images, JS bundles, etc.)

## Documentation

- [ ] Code includes appropriate comments for complex logic
- [ ] API endpoints are documented
- [ ] README or documentation is updated if necessary
- [ ] Changes to configuration or environment variables are documented
- [ ] Breaking changes are clearly communicated

## Database

- [ ] Database migrations are properly implemented
- [ ] Indexes are created for frequently queried fields
- [ ] No raw SQL queries without proper parameter binding
- [ ] Database schema changes are backward compatible or have a migration path
- [ ] Foreign key constraints are properly defined
- [ ] Database transactions are used for multi-step operations

## Deployment Considerations

- [ ] Changes don't break existing functionality
- [ ] Environment variables are updated if needed
- [ ] Database migrations can be applied without downtime
- [ ] Deployment instructions are provided if necessary
- [ ] Rollback plan is considered

## Pull Request Quality

- [ ] PR description clearly explains the changes and why they're needed
- [ ] PR is of reasonable size (not too many changes at once)
- [ ] PR addresses a single concern or related concerns
- [ ] All automated checks pass (CI/CD, linting, tests)
- [ ] PR references related issues or tickets

## Final Checks

- [ ] Code has been tested locally
- [ ] All review comments have been addressed
- [ ] Changes meet the requirements of the task/issue
- [ ] No regressions introduced

## How to Use This Checklist

1. Copy this checklist into your pull request description or comments
2. Check off items as you review the code
3. Add comments or questions for items that need attention
4. Request changes if necessary items are not addressed
5. Approve the PR when all relevant items are checked

Remember that this checklist is a guide, not a strict rulebook. Use your judgment to determine which items are relevant for each specific code change. 