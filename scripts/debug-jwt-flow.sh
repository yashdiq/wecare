#!/bin/bash

# Debugging script for JWT and user data flow
# This script will help trace the JWT flow and user data in the API Gateway and microservices

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====================================================${NC}"
echo -e "${YELLOW}       JWT and User Data Flow Debugging Tool         ${NC}"
echo -e "${YELLOW}====================================================${NC}"

# Check if containers are running
echo -e "\n${BLUE}Checking if containers are running...${NC}"
if ! docker ps | grep -q "wecare-api-gateway"; then
  echo -e "${RED}WeCare containers are not running. Please start them first.${NC}"
  exit 1
fi

# Test database connectivity
echo -e "\n${BLUE}Testing database connectivity...${NC}"
echo -e "PostgreSQL connection:"
docker exec wecare-postgres pg_isready -U postgres
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Database connection successful!${NC}"
else
  echo -e "${RED}Database connection failed!${NC}"
fi

# Check if JWT_SECRET is set correctly in each service
echo -e "\n${BLUE}Checking JWT_SECRET configuration...${NC}"
for service in wecare-api-gateway wecare-shift-service wecare-visit-service; do
  echo -e "Checking JWT_SECRET in $service:"
  jwt_secret=$(docker exec $service printenv | grep JWT_SECRET)
  if [ -n "$jwt_secret" ]; then
    echo -e "${GREEN}JWT_SECRET is set in $service${NC}"
  else
    echo -e "${RED}JWT_SECRET is NOT set in $service${NC}"
  fi
done

# Check inter-service communication
echo -e "\n${BLUE}Testing inter-service communication...${NC}"
echo -e "API Gateway to Shift Service connectivity:"
docker exec wecare-api-gateway ping -c 2 shift-service
echo -e "API Gateway to Visit Service connectivity:"
docker exec wecare-api-gateway ping -c 2 visit-service

# Check user table in database
echo -e "\n${BLUE}Checking users in database...${NC}"
echo -e "Users in the database:"
docker exec wecare-postgres psql -U postgres -d wecare -c "SELECT id, email, role FROM users;"

# Verify JWT token authentication
echo -e "\n${BLUE}Verifying JWT token authentication...${NC}"
echo -e "Attempting to log in and get JWT token..."
token_response=$(curl -s -X POST http://localhost:4200/auth/login -H "Content-Type: application/json" -d '{"email":"caregiver@wecare.com","password":"supersecret"}')
echo "Token response: $token_response"

token=$(echo $token_response | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
if [ -n "$token" ]; then
  echo -e "${GREEN}Successfully obtained JWT token${NC}"
  echo -e "Testing JWT token with shift endpoint..."
  shift_response=$(curl -s -X GET http://localhost:4200/shifts -H "Authorization: Bearer $token")
  echo "Shift response: $shift_response"
else
  echo -e "${RED}Failed to obtain JWT token${NC}"
fi

# Print recent logs
echo -e "\n${BLUE}Recent logs from services...${NC}"
echo -e "API Gateway logs (last 10 lines):"
docker logs --tail 10 wecare-api-gateway
echo -e "\nShift Service logs (last 10 lines):"
docker logs --tail 10 wecare-shift-service
echo -e "\nVisit Service logs (last 10 lines):"
docker logs --tail 10 wecare-visit-service

echo -e "\n${YELLOW}===================================================${NC}"
echo -e "${YELLOW}            Debugging Complete                      ${NC}"
echo -e "${YELLOW}===================================================${NC}"
