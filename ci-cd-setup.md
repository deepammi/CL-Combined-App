# CI/CD Setup Guide for CL Application

This guide outlines how to set up Continuous Integration and Continuous Deployment (CI/CD) for the CL application using GitHub Actions.

## Prerequisites

- GitHub repository with the CL application code
- AWS account with appropriate permissions
- Deployment environment (e.g., AWS EC2, Vercel, Netlify)
- Database server (PostgreSQL)

## GitHub Actions Workflow Setup

### 1. Create GitHub Actions Directory

Create a `.github/workflows` directory in your repository:

```bash
mkdir -p .github/workflows
```

### 2. Backend CI/CD Workflow

Create a file named `backend-ci-cd.yml` in the `.github/workflows` directory:

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'cl-backendv4/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'cl-backendv4/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: cl_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: cl-backendv4/package-lock.json
      
      - name: Install dependencies
        working-directory: cl-backendv4
        run: npm ci
      
      - name: Set up environment variables
        working-directory: cl-backendv4
        run: |
          echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cl_test" > .env.test
          echo "AWS_ACCESS_KEY=${{ secrets.AWS_ACCESS_KEY }}" >> .env.test
          echo "AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }}" >> .env.test
          echo "AWS_REGION=${{ secrets.AWS_REGION }}" >> .env.test
          echo "AWS_S3_BUCKET=${{ secrets.AWS_S3_BUCKET }}" >> .env.test
          echo "AWS_S3_CALLS_BUCKET=${{ secrets.AWS_S3_CALLS_BUCKET }}" >> .env.test
      
      - name: Run Prisma migrations
        working-directory: cl-backendv4
        run: npx prisma migrate deploy
      
      - name: Run tests
        working-directory: cl-backendv4
        run: npm test
      
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
        with:
          directory: cl-backendv4/coverage
          flags: backend
  
  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: cl-backendv4/package-lock.json
      
      - name: Install dependencies
        working-directory: cl-backendv4
        run: npm ci
      
      - name: Build application
        working-directory: cl-backendv4
        run: npm run build
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /path/to/deployment
            git pull
            cd cl-backendv4
            npm ci
            npm run build
            pm2 restart cl-backend
```

### 3. Frontend CI/CD Workflow

Create a file named `frontend-ci-cd.yml` in the `.github/workflows` directory:

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'cl-frontendv4/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'cl-frontendv4/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: cl-frontendv4/package-lock.json
      
      - name: Install dependencies
        working-directory: cl-frontendv4
        run: npm ci
      
      - name: Run linting
        working-directory: cl-frontendv4
        run: npm run lint
      
      - name: Run tests
        working-directory: cl-frontendv4
        run: npm test
      
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
        with:
          directory: cl-frontendv4/coverage
          flags: frontend
  
  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: cl-frontendv4/package-lock.json
      
      - name: Install dependencies
        working-directory: cl-frontendv4
        run: npm ci
      
      - name: Build application
        working-directory: cl-frontendv4
        run: npm run build
        env:
          NEXT_PUBLIC_API_BASEURL: ${{ secrets.NEXT_PUBLIC_API_BASEURL }}
      
      # Option 1: Deploy to Vercel
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: cl-frontendv4
          vercel-args: '--prod'
      
      # Option 2: Deploy to AWS S3 + CloudFront
      # - name: Configure AWS credentials
      #   uses: aws-actions/configure-aws-credentials@v1
      #   with:
      #     aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
      #     aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      #     aws-region: ${{ secrets.AWS_REGION }}
      # 
      # - name: Deploy to S3
      #   working-directory: cl-frontendv4
      #   run: |
      #     aws s3 sync ./out s3://${{ secrets.AWS_S3_BUCKET }} --delete
      # 
      # - name: Invalidate CloudFront cache
      #   run: |
      #     aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## GitHub Repository Secrets

Set up the following secrets in your GitHub repository:

### AWS Credentials
- `AWS_ACCESS_KEY`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `AWS_S3_BUCKET`: S3 bucket for frontend deployment
- `AWS_S3_CALLS_BUCKET`: S3 bucket for call recordings

### EC2 Deployment
- `EC2_HOST`: EC2 instance hostname or IP
- `EC2_USERNAME`: SSH username (e.g., ec2-user)
- `EC2_SSH_KEY`: SSH private key for EC2 access

### Vercel Deployment (if using Vercel)
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Frontend Environment
- `NEXT_PUBLIC_API_BASEURL`: Backend API URL

## Setting Up Environment Variables

### Backend Environment Variables

Create a `.env.production` file in the `cl-backendv4` directory:

```
DATABASE_URL=postgresql://username:password@hostname:5432/database
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket
AWS_S3_CALLS_BUCKET=your_calls_bucket
PORT=3000
NODE_ENV=production
```

### Frontend Environment Variables

Create a `.env.production` file in the `cl-frontendv4` directory:

```
NEXT_PUBLIC_API_BASEURL=https://your-backend-api.com
```

## Database Migrations

Ensure your database migrations are set up correctly:

1. Create a migration script:

```bash
#!/bin/bash
# deploy-migrations.sh

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database if needed
npx prisma db seed
```

2. Make the script executable:

```bash
chmod +x deploy-migrations.sh
```

3. Add the script to your deployment process.

## Monitoring and Logging

### Backend Monitoring

1. Set up PM2 for process management:

```bash
npm install -g pm2
pm2 start dist/src/server.js --name cl-backend
pm2 save
```

2. Configure PM2 to start on system boot:

```bash
pm2 startup
```

### Frontend Monitoring

If using Vercel or Netlify, monitoring is built-in. For custom deployments:

1. Set up application monitoring with a service like New Relic or Datadog.
2. Configure error tracking with Sentry.

## Conclusion

This CI/CD setup provides:

1. **Automated Testing**: All code changes are automatically tested.
2. **Continuous Deployment**: Successful changes on the main branch are automatically deployed.
3. **Environment Consistency**: Environment variables are managed securely.
4. **Monitoring**: Application performance and errors are tracked.

By following this guide, you can ensure reliable and consistent deployments of the CL application. 