#!/bin/bash

# WeCare Docker Reset Script
# This script resets the Docker setup and rebuilds all containers

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}WeCare Docker Reset Script${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Stop and remove all containers
echo -e "Stopping and removing all containers..."
docker-compose down
echo -e "${GREEN}Containers stopped.${NC}\n"

# Ask if the user wants to remove volumes
read -p "Do you want to remove volumes (will delete database data)? (y/n): " choice
if [[ $choice == [Yy]* ]]; then
  echo -e "Removing volumes..."
  docker-compose down -v
  echo -e "${GREEN}Volumes removed.${NC}\n"
fi

# Clean Docker cache
echo -e "Cleaning Docker build cache for wecare containers..."
docker system prune -f --filter "label=com.docker.compose.project=wecare"
echo -e "${GREEN}Docker cache cleaned.${NC}\n"

# Ask if the user wants to rebuild and start the containers
read -p "Do you want to rebuild and start the containers? (y/n): " choice
if [[ $choice == [Yy]* ]]; then
  echo -e "Rebuilding and starting containers..."
  docker-compose up --build -d
  echo -e "${GREEN}Containers rebuilt and started.${NC}\n"
  
  # Wait for services to be available
  echo -e "Waiting for services to be available..."
  sleep 10
  
  # Check if API Gateway is up
  echo -e "Checking if API Gateway is up..."
  retry=0
  max_retries=5
  api_is_up=false
  
  while [ $retry -lt $max_retries ] && [ "$api_is_up" != "true" ]; do
    if curl -s http://localhost:4200/api -I | grep -q "200 OK"; then
      api_is_up=true
      echo -e "${GREEN}API Gateway is up!${NC}\n"
    else
      retry=$((retry+1))
      echo -e "API Gateway not ready yet. Retry $retry of $max_retries..."
      sleep 5
    fi
  done
  
  if [ "$api_is_up" != "true" ]; then
    echo -e "${RED}API Gateway is not responding. Check the logs for errors:${NC}"
    docker-compose logs api-gateway
  fi
  
  echo -e "${YELLOW}Containers are running in the background.${NC}"
  echo -e "${YELLOW}Frontend available at: http://localhost:3000${NC}"
  echo -e "${YELLOW}API Gateway available at: http://localhost:4200${NC}"
else
  echo -e "${YELLOW}Containers not started. Run 'docker-compose up --build' to start them.${NC}"
fi

exit 0
