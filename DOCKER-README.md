# WeCare Docker Setup

This README provides instructions for running the WeCare application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git (to clone the repository)

## Getting Started

1. Clone the repository (if you haven't already):

   ```bash
   git clone git@github.com:yashdiq/wecare.git
   cd wecare
   ```

2. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

   This will start the following services:

   - PostgreSQL database
   - API Gateway (NestJS)
   - Shift microservice (NestJS)
   - Visit microservice (NestJS)
   - Frontend (Next.js)

3. Access the applications:

   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:4200
   - API Documentation: http://localhost:4200/api
   - Shift Service: http://localhost:4201 (internal)
   - Visit Service: http://localhost:4202 (internal)

4. Login to the application:

   - Email: `caregiver@wecare.com`
   - Password: `supersecret`

   This default user is created by the seed script during initial setup. The user has the role of `CAREGIVER` and is associated with a client named "Jane Doe" and a pre-configured shift.

## Stopping the Application

To stop the application, press `Ctrl+C` in the terminal where `docker-compose up` is running.

To stop and remove the containers:

```bash
docker-compose down
```

To stop and remove the containers along with the volumes (including the database data):

```bash
docker-compose down -v
```

## Development Workflow

### Making Changes

When you make changes to the code, the following development workflow is recommended:

1. The Docker setup includes volume mounts for source code, so many changes will be reflected in real-time:

   - Backend code changes will require a container restart
   - Frontend code changes may trigger hot reloading automatically

2. For changes that require rebuilding the containers:

   ```bash
   docker-compose up --build
   ```

3. For changes to NestJS service dependencies (new npm packages):

   ```bash
   docker-compose down
   docker-compose build api-gateway shift-service visit-service
   docker-compose up
   ```

4. For changes to frontend dependencies:
   ```bash
   docker-compose down
   docker-compose build frontend
   docker-compose up
   ```

### Database Changes

When making schema changes:

1. Update the Prisma schema in `apps/backend/prisma/schema.prisma`
2. Create a migration:
   ```bash
   docker exec -it wecare-api-gateway npx prisma migrate dev --name your_migration_name
   ```

## Environment Variables

The following environment variables are used by the services:

### Required for all services

- `JWT_SECRET`: Secret key for JWT authentication (all services need this for JWT validation)

### API Gateway

- `NODE_ENV`: Set to "production" or "development"
- `DATABASE_URL`: PostgreSQL connection string
- `SHIFT_SERVICE_HOST`: Hostname of the shift service
- `VISIT_SERVICE_HOST`: Hostname of the visit service
- `PORT`: Port to run the API Gateway on (default: 4200)

### Shift Service

- `NODE_ENV`: Set to "production" or "development"
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `PORT`: Port to run the Shift service on (default: 4201)
- `SHIFT`: Host to bind the microservice to (use 0.0.0.0 in Docker)
- `HOST`: Host for logging purposes (use 0.0.0.0 in Docker)

### Visit Service

- `NODE_ENV`: Set to "production" or "development"
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `PORT`: Port to run the Visit service on (default: 4202)
- `VISIT`: Host to bind the microservice to (use 0.0.0.0 in Docker)
- `HOST`: Host for logging purposes (use 0.0.0.0 in Docker)

### Frontend

- `NODE_ENV`: Set to "production" or "development"
- `NEXT_PUBLIC_API_URL`: URL of the API Gateway

## Troubleshooting

If you encounter connection issues between services:

1. Check service logs for errors:

   ```bash
   docker-compose logs api-gateway
   docker-compose logs shift-service
   docker-compose logs visit-service
   ```

2. Ensure database is healthy:

   ```bash
   docker-compose logs db
   ```

3. Verify that containers can communicate:

   ```bash
   docker exec -it wecare-api-gateway ping db
   docker exec -it wecare-api-gateway ping shift-service
   ```

4. If database connection issues persist:

   ```bash
   # Check if the DATABASE_URL environment variable is correctly set
   docker exec -it wecare-api-gateway printenv | grep DATABASE_URL

   # Manually test the database connection
   docker exec -it wecare-api-gateway npx prisma db push --skip-generate
   ```

5. If needed, restart a specific service:
   ```bash
   docker-compose restart api-gateway
   ```

### Accessing the Container Shell

To access a shell in one of the containers:

```bash
docker exec -it wecare-api-gateway bash
docker exec -it wecare-shift-service bash
docker exec -it wecare-visit-service bash
docker exec -it wecare-frontend sh
docker exec -it wecare-postgres bash
```

### Viewing Logs

To view logs for a specific service:

```bash
docker-compose logs api-gateway
docker-compose logs shift-service
docker-compose logs visit-service
docker-compose logs frontend
docker-compose logs db
```

Add the `-f` flag to follow the logs:

```bash
docker-compose logs -f api-gateway
```

## Database Management

### Running Migrations

Migrations are automatically run when the containers start up.

To manually run migrations:

```bash
docker exec -it wecare-api-gateway npx prisma migrate deploy
```

### Seeding the Database

The database is automatically seeded with initial test data when the api-gateway container starts up. This creates:

- A test user with the role CAREGIVER
- A test client
- A test shift assigned to the caregiver and client

To manually seed the database:

```bash
docker exec -it wecare-api-gateway npx prisma db seed
```

### Test Credentials

After seeding, you can log in with the following credentials:

- Email: caregiver@wecare.com
- Password: supersecret

### Accessing the Database

To access the PostgreSQL database directly:

```bash
docker exec -it wecare-postgres psql -U postgres -d wecare
```

## Troubleshooting

### Container Not Starting

If a container fails to start, check the logs:

```bash
docker-compose logs <service-name>
```

### Database Connection Issues

If services can't connect to the database, make sure the database container is running:

```bash
docker ps | grep postgres
```

And check that the `DATABASE_URL` environment variable is correctly set in the service configuration.

If you get "Cannot read properties of null (reading 'id')" errors, this typically means that the database doesn't have the required data. Make sure the database was seeded correctly:

```bash
docker exec -it wecare-api-gateway npx prisma db seed
```

You can also reset the database completely:

```bash
docker exec -it wecare-api-gateway npx prisma migrate reset --force
```

### Development Mode

For a better development experience, you can create a `docker-compose.override.yml` file with the following content:

```yaml
version: "3.9"

services:
  api-gateway:
    environment:
      - NODE_ENV=development
    command: >
      sh -c "wait-for-it db:5432 -t 60 -- echo 'Database is up' &&
             npx prisma migrate deploy &&
             npm run start:dev api-gateway"

  shift-service:
    environment:
      - NODE_ENV=development
    command: >
      sh -c "wait-for-it db:5432 -t 60 -- echo 'Database is up' &&
             npx prisma migrate deploy &&
             npm run start:dev shift"

  visit-service:
    environment:
      - NODE_ENV=development
    command: >
      sh -c "wait-for-it db:5432 -t 60 -- echo 'Database is up' &&
             npx prisma migrate deploy &&
             npm run start:dev visit"

  frontend:
    environment:
      - NODE_ENV=development
    command: npm run dev
```

This will enable hot reloading for all services in development mode.

### Clearing Docker Cache

If you're experiencing unexpected behavior, try clearing Docker's build cache:

```bash
docker builder prune -f
```

Then rebuild the containers:

```bash
docker-compose up --build
```

## Utility Scripts

To help with common Docker-related tasks, the following utility scripts are included:

### Testing Docker Setup

A test script is provided to verify that all components of the WeCare application are working correctly:

```bash
./test-docker-setup.sh
```

This script will:

- Check if Docker and docker-compose are available
- Start all containers if they aren't already running
- Test database connections
- Verify that all services are running
- Test communication between services
- Verify that seed data is present

### Resetting Docker Environment

If you need to reset your Docker environment (e.g., after major changes):

```bash
./reset-docker.sh
```

This script will:

- Stop all containers
- Optionally remove volumes (database data)
- Clean Docker cache
- Optionally rebuild and restart all containers

## Monitoring

To monitor the health and status of all WeCare services:

```bash
./monitor-wecare.sh
```

This script provides a comprehensive dashboard showing:

- Container status
- API endpoint health
- Database connection status
- Record counts in key tables
- Recent log errors
- Resource usage metrics

Run this script whenever you want to check the overall health of your deployment.

## Common Issues and Solutions

### Authentication Issues

If you encounter authentication errors or "User not found" messages in the service logs:

1. Run the authentication test script to diagnose the issue:

   ```bash
   ./scripts/test-auth-flow.sh
   ```

2. If authentication problems are detected, you can try the automatic repair script:

   ```bash
   ./scripts/fix-jwt-issues.sh
   ```

3. Verify that JWT_SECRET is consistently set across all services:

   ```bash
   ./scripts/debug-jwt-flow.sh
   ```

4. Check that the user exists in the database:

   ```bash
   docker exec wecare-postgres psql -U postgres -d wecare -c "SELECT * FROM users;"
   ```

5. If needed, manually run the seed script to create the test user:

   ```bash
   docker exec wecare-api-gateway npx prisma db seed
   ```

The default authentication credentials (from seed.ts) are:

- Email: `caregiver@wecare.com`
- Password: `supersecret`
- Role: `CAREGIVER`

This user is automatically created when the database is seeded.
