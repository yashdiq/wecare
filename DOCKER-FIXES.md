# WeCare Docker Setup Fixes

This document summarizes the improvements and fixes made to the WeCare application's Docker setup, focusing on resolving authentication issues, microservice communication, and database connectivity.

## Key Issues Fixed

1. **JWT Authentication Flow**

   - Added consistent JWT_SECRET environment variables to all services
   - Enhanced JWT strategy with better error handling and debug logging
   - Added tools to diagnose and fix authentication flow issues

2. **Microservice Communication**

   - Improved message payload handling in shift service
   - Added detailed logging for debugging microservice communications
   - Fixed issues with user data passing between API Gateway and microservices

3. **Database Connectivity**

   - Added retry mechanism for database connections
   - Ensured all services have access to Prisma schema and migrations
   - Added additional health checks to verify database connections

4. **Docker Configuration**
   - Enhanced Dockerfile with a more robust entrypoint script
   - Added better volume mapping for development and debugging
   - Added PGAdmin for easier database management in development mode

## New Utility Scripts

### 1. Testing Scripts

- **test-docker-setup.sh**: Tests the entire Docker setup, verifying all components
- **test-auth-flow.sh**: Tests the authentication flow from login to microservice communication

### 2. Debugging Scripts

- **debug-jwt-flow.sh**: Diagnoses issues with JWT authentication and user data flow
- **monitor-wecare.sh**: Provides a monitoring dashboard for all WeCare services

### 3. Fix Scripts

- **fix-jwt-issues.sh**: Automatically attempts to fix common JWT and authentication issues
- **reset-docker.sh**: Resets the Docker environment, optionally cleaning volumes and rebuilding containers

## How to Use These Tools

### When Starting a New Development Session

```bash
# Start the services in development mode
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Verify everything is working
./test-docker-setup.sh
```

### When Encountering Authentication Issues

```bash
# Test the authentication flow
./test-auth-flow.sh

# If issues are detected, run the fix script
./fix-jwt-issues.sh
```

### For Ongoing Monitoring

```bash
# Monitor all services in real-time
./monitor-wecare.sh
```

### When Making Major Changes

```bash
# Reset the Docker environment and rebuild
./reset-docker.sh
```

## Troubleshooting Tips

1. **"User not found" Errors**

   - Run `./test-auth-flow.sh` to diagnose
   - Check database for user records: `docker exec wecare-postgres psql -U postgres -d wecare -c "SELECT * FROM users;"`
   - Run seed again if needed: `docker exec wecare-api-gateway npx prisma db seed`

2. **Database Connection Issues**

   - Verify database is running: `docker ps | grep postgres`
   - Check connection strings in environment variables
   - Use PGAdmin at http://localhost:5050 (login: admin@wecare.com / password: admin)

3. **Microservice Communication Problems**

   - Check if services can communicate: `docker exec wecare-api-gateway ping shift-service`
   - Verify ports are exposed correctly: `docker-compose ps`
   - Check service logs: `docker-compose logs shift-service`

4. **Authentication Credentials**
   - Default user is automatically created during database seeding:
     - Email: `caregiver@wecare.com`
     - Password: `supersecret`
     - Role: `CAREGIVER`
   - This user is associated with a shift and client to enable full application testing

## Development Workflow

1. Make code changes
2. Run `docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d` to apply changes
3. Test changes with `./test-docker-setup.sh` or `./test-auth-flow.sh`
4. Monitor the application with `./monitor-wecare.sh`

For more details, refer to the comprehensive DOCKER-README.md documentation.
