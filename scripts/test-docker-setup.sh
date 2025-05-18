#!/bin/bash

# WeCare Docker Setup Test Script
# This script tests the Docker setup by checking various components
# and connections in the WeCare application.

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting WeCare Docker Setup Test${NC}\n"

# Check if Docker is running
echo -e "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
else
  echo -e "${GREEN}Docker is running!${NC}\n"
fi

# Check if docker-compose is available
echo -e "Checking if docker-compose is available..."
if ! command -v docker-compose > /dev/null 2>&1; then
  echo -e "${RED}docker-compose is not installed. Please install it and try again.${NC}"
  exit 1
else
  echo -e "${GREEN}docker-compose is available!${NC}\n"
fi

# Check if the docker-compose.yml file exists
echo -e "Checking if docker-compose.yml file exists..."
if [ ! -f "./docker-compose.yml" ]; then
  echo -e "${RED}docker-compose.yml file not found. Make sure you are in the correct directory.${NC}"
  exit 1
else
  echo -e "${GREEN}docker-compose.yml file found!${NC}\n"
fi

# Check if there are any running containers
echo -e "Checking for running WeCare containers..."
if docker ps | grep -q "wecare"; then
  echo -e "${YELLOW}WeCare containers are already running. Stopping them...${NC}"
  docker-compose down
  echo -e "${GREEN}Containers stopped.${NC}\n"
fi

# Start the containers
echo -e "Starting WeCare containers..."
docker-compose up -d
echo -e "${GREEN}Containers started in the background!${NC}\n"

# Wait for services to be ready
echo -e "Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL container is running
echo -e "Checking if PostgreSQL container is running..."
if docker ps | grep -q "wecare-postgres"; then
  echo -e "${GREEN}PostgreSQL container is running!${NC}\n"
else
  echo -e "${RED}PostgreSQL container is not running. Check the logs for errors:${NC}"
  docker-compose logs db
  exit 1
fi

# Test PostgreSQL connection
echo -e "Testing PostgreSQL connection..."
if docker exec wecare-postgres pg_isready -U postgres > /dev/null 2>&1; then
  echo -e "${GREEN}PostgreSQL connection successful!${NC}\n"
else
  echo -e "${RED}PostgreSQL connection failed. Check the logs for errors:${NC}"
  docker-compose logs db
  exit 1
fi

# Check if API Gateway container is running
echo -e "Checking if API Gateway container is running..."
if docker ps | grep -q "wecare-api-gateway"; then
  echo -e "${GREEN}API Gateway container is running!${NC}\n"
else
  echo -e "${RED}API Gateway container is not running. Check the logs for errors:${NC}"
  docker-compose logs api-gateway
  exit 1
fi

# Check if Shift service container is running
echo -e "Checking if Shift service container is running..."
if docker ps | grep -q "wecare-shift-service"; then
  echo -e "${GREEN}Shift service container is running!${NC}\n"
else
  echo -e "${RED}Shift service container is not running. Check the logs for errors:${NC}"
  docker-compose logs shift-service
  exit 1
fi

# Check if Visit service container is running
echo -e "Checking if Visit service container is running..."
if docker ps | grep -q "wecare-visit-service"; then
  echo -e "${GREEN}Visit service container is running!${NC}\n"
else
  echo -e "${RED}Visit service container is not running. Check the logs for errors:${NC}"
  docker-compose logs visit-service
  exit 1
fi

# Check if Frontend container is running
echo -e "Checking if Frontend container is running..."
if docker ps | grep -q "wecare-frontend"; then
  echo -e "${GREEN}Frontend container is running!${NC}\n"
else
  echo -e "${RED}Frontend container is not running. Check the logs for errors:${NC}"
  docker-compose logs frontend
  exit 1
fi

# Test API Gateway HTTP connection
echo -e "Testing API Gateway HTTP connection..."
if curl -s http://localhost:4200/api 2>&1 | grep -q "WeCare"; then
  echo -e "${GREEN}API Gateway HTTP connection successful!${NC}\n"
else
  echo -e "${RED}API Gateway HTTP connection failed. Check the logs for errors:${NC}"
  docker-compose logs api-gateway
fi

# Test Microservice Communication
echo -e "Testing API Gateway to microservices communication..."
echo -e "${YELLOW}Looking for connection patterns in logs. This may take a moment...${NC}"
if docker-compose logs api-gateway | grep -q "shift_service"; then
  echo -e "${GREEN}API Gateway to Shift Service communication detected!${NC}"
else
  echo -e "${YELLOW}No explicit Shift Service communication found in logs. This might be normal if no requests have been made.${NC}"
fi

if docker-compose logs api-gateway | grep -q "visit_service"; then
  echo -e "${GREEN}API Gateway to Visit Service communication detected!${NC}\n"
else
  echo -e "${YELLOW}No explicit Visit Service communication found in logs. This might be normal if no requests have been made.${NC}\n"
fi

# Test Frontend HTTP connection
echo -e "Testing Frontend HTTP connection..."
if curl -s http://localhost:3000 -I | grep -q "200 OK"; then
  echo -e "${GREEN}Frontend HTTP connection successful!${NC}\n"
else
  echo -e "${RED}Frontend HTTP connection failed. Check the logs for errors:${NC}"
  docker-compose logs frontend
fi

# Test seed data
echo -e "Verifying database seed data..."
if docker exec wecare-postgres psql -U postgres -d wecare -c "SELECT COUNT(*) FROM users;" | grep -q "1"; then
  echo -e "${GREEN}Database seed data verified!${NC}\n"
else
  echo -e "${YELLOW}Database may not be properly seeded. Attempting to seed manually...${NC}"
  docker exec wecare-api-gateway npx prisma db seed
  echo -e "${GREEN}Manual seeding attempted.${NC}\n"
fi

echo -e "${YELLOW}WeCare Docker test summary:${NC}"
echo -e "1. PostgreSQL: ${GREEN}Running${NC}"
echo -e "2. API Gateway: ${GREEN}Running${NC}"
echo -e "3. Shift Service: ${GREEN}Running${NC}"
echo -e "4. Visit Service: ${GREEN}Running${NC}"
echo -e "5. Frontend: ${GREEN}Running${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Access the frontend at http://localhost:3000"
echo -e "2. Login with:"
echo -e "   Email: caregiver@wecare.com"
echo -e "   Password: supersecret"
echo -e "3. Access API documentation at http://localhost:4200/api"

# Ask if user wants to stop containers
read -p "Do you want to stop all containers? (y/n): " choice
if [[ $choice == [Yy]* ]]; then
  echo -e "\nStopping containers..."
  docker-compose down
  echo -e "${GREEN}Containers stopped.${NC}"
else
  echo -e "\n${GREEN}Containers are still running.${NC}"
fi

exit 0
