#!/bin/bash

# Enhanced entrypoint script for WeCare backend services
# This script ensures proper database connection and JWT authentication setup

APP_NAME=${APP_NAME:-"unknown"}
echo "Starting $APP_NAME service..."

# Check for node_modules
if [ ! -d "/app/node_modules" ]; then
  echo "ERROR: node_modules directory not found!"
  echo "This indicates the npm install process failed during the build."
  echo "Please check the Docker build logs for more information."
  exit 1
fi

# Basic node_modules validation for critical packages
if [ ! -d "/app/node_modules/@nestjs" ]; then
  echo "ERROR: NestJS packages not found in node_modules!"
  echo "The npm install process may have partially failed."
  echo "Please rebuild the Docker image with better logging."
  exit 1
fi

# Check if JWT_SECRET is set
if [ -z "$JWT_SECRET" ]; then
  echo "ERROR: JWT_SECRET environment variable is not set!"
  echo "This is required for authentication to work properly."
  exit 1
else
  echo "JWT_SECRET is properly configured."
fi

# Wait for database to be available
echo "Waiting for database..."
wait-for-it db:5432 -t 60
if [ $? -ne 0 ]; then
  echo "ERROR: Database connection timed out!"
  exit 1
fi
echo "Database is up"

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "ERROR: Database migration failed!"
  exit 1
fi
echo "Migrations completed successfully"

# Run seed data if this is the API Gateway
if [ "$APP_NAME" = "api-gateway" ]; then
  echo "Running seed data..."
  npx prisma db seed
  if [ $? -ne 0 ]; then
    echo "WARNING: Database seeding returned errors"
    # Don't exit on seed errors, might be because data already exists
  else
    echo "Seed data loaded successfully"
  fi
fi

# Log important configuration
echo "Service configuration:"
echo "- NODE_ENV: $NODE_ENV"
echo "- Database URL: $DATABASE_URL"
echo "- PORT: $PORT"

# Verify JWT strategy (for microservices)
if [ "$APP_NAME" = "shift" ] || [ "$APP_NAME" = "visit" ]; then
  echo "Microservice binding configuration:"
  echo "- HOST: $HOST"
  if [ "$APP_NAME" = "shift" ]; then
    echo "- SHIFT: $SHIFT"
  elif [ "$APP_NAME" = "visit" ]; then
    echo "- VISIT: $VISIT"
  fi
fi

# Start the application
echo "Starting $APP_NAME service..."
if [ "$NODE_ENV" = "development" ]; then
  echo "Running in DEVELOPMENT mode"
  npm run start:dev $APP_NAME
else
  echo "Running in PRODUCTION mode"
  node dist/apps/$APP_NAME/main
fi
