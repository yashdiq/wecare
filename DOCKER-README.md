# WeCare Docker Setup

This README provides instructions for running the WeCare application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git (to clone the repository)

## Getting Started

1. Clone the repository (if you haven't already):

   ```bash
   git clone <repository-url>
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

When you make changes to the code:

1. Rebuild the containers:
   ```bash
   docker-compose up --build
   ```

### Accessing the Container Shell

To access a shell in one of the containers:

```bash
docker exec -it wecare-api-gateway sh
docker exec -it wecare-shift-service sh
docker exec -it wecare-visit-service sh
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

### Clearing Docker Cache

If you're experiencing unexpected behavior, try clearing Docker's build cache:

```bash
docker builder prune -f
```

Then rebuild the containers:

```bash
docker-compose up --build
```
