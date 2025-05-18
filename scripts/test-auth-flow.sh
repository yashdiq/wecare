#!/bin/bash

# WeCare Authentication Test Script
# Tests the entire authentication flow to ensure JWT token and user data are properly handled

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===================================================${NC}"
echo -e "${YELLOW}       WeCare Authentication Test Script            ${NC}"
echo -e "${YELLOW}===================================================${NC}"

# Ensure containers are running
if ! docker ps | grep -q "wecare-api-gateway"; then
  echo -e "${RED}WeCare containers are not running. Please start them first.${NC}"
  exit 1
fi

# Function to make API calls
call_api() {
  local endpoint=$1
  local method=${2:-"GET"}
  local data=$3
  local auth_header=$4
  
  if [ -n "$auth_header" ]; then
    curl -s -X $method "http://localhost:4200/$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $auth_header" \
      ${data:+-d "$data"}
  else
    curl -s -X $method "http://localhost:4200/$endpoint" \
      -H "Content-Type: application/json" \
      ${data:+-d "$data"}
  fi
}

# Step 1: Login and get JWT token
echo -e "\n${BLUE}Step 1: Testing login with valid credentials${NC}"
login_response=$(call_api "auth/login" "POST" '{"email":"caregiver@wecare.com","password":"supersecret"}')
echo "Login response: $login_response"

# Extract token
token=$(echo $login_response | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"//;s/"//')

if [ -z "$token" ]; then
  echo -e "${RED}Failed to get access token. Authentication flow cannot continue.${NC}"
  # Let's create a new user if there might be an issue
  echo -e "${YELLOW}Attempting to recreate test user...${NC}"
  docker exec wecare-api-gateway npx prisma db seed
  echo -e "${YELLOW}Please run this script again after the user is created.${NC}"
  exit 1
else
  echo -e "${GREEN}Successfully obtained JWT token${NC}"
  echo "Token: $token"
fi

# Step 2: Test accessing shifts endpoint
echo -e "\n${BLUE}Step 2: Testing shifts endpoint with JWT token${NC}"
shift_response=$(call_api "shifts" "GET" "" "$token")
echo "Shifts response: $shift_response"

if echo $shift_response | grep -q "id"; then
  echo -e "${GREEN}Successfully retrieved shift data${NC}"
else
  echo -e "${RED}Failed to retrieve shift data${NC}"
  
  # Debug error
  echo -e "${YELLOW}Checking service logs for errors...${NC}"
  echo -e "\nAPI Gateway logs:"
  docker logs --tail 20 wecare-api-gateway | grep -i "error\|warn"
  
  echo -e "\nShift Service logs:"
  docker logs --tail 20 wecare-shift-service | grep -i "error\|warn"
fi

# Step 3: Check JWT validation in services
echo -e "\n${BLUE}Step 3: Testing JWT handling in services${NC}"
echo -e "Checking JWT environment variables:"
for service in wecare-api-gateway wecare-shift-service wecare-visit-service; do
  jwt=$(docker exec $service printenv JWT_SECRET)
  if [ -z "$jwt" ]; then
    echo -e "${RED}$service: JWT_SECRET not set${NC}"
  else
    echo -e "${GREEN}$service: JWT_SECRET correctly set${NC}"
  fi
done

# Step 4: Test user database connectivity
echo -e "\n${BLUE}Step 4: Testing database user lookup${NC}"
user_count=$(docker exec wecare-postgres psql -U postgres -d wecare -t -c "SELECT COUNT(*) FROM users WHERE email='caregiver@wecare.com';")
user_count=$(echo $user_count | tr -d '[:space:]')

if [ "$user_count" -eq "1" ]; then
  echo -e "${GREEN}User 'caregiver@wecare.com' exists in database${NC}"
  
  # Get user details for verification
  user_details=$(docker exec wecare-postgres psql -U postgres -d wecare -t -c "SELECT id, email, role FROM users WHERE email='caregiver@wecare.com';")
  echo "User details: $user_details"
else
  echo -e "${RED}User 'caregiver@wecare.com' NOT found in database${NC}"
  echo -e "${YELLOW}Running database seed to create test user...${NC}"
  docker exec wecare-api-gateway npx prisma db seed
fi

echo -e "\n${YELLOW}===================================================${NC}"
echo -e "${YELLOW}       Authentication Test Complete                 ${NC}"
echo -e "${YELLOW}===================================================${NC}"

if echo $shift_response | grep -q "id"; then
  echo -e "${GREEN}Authentication flow working correctly!${NC}"
else
  echo -e "${RED}Authentication flow has issues - please check the logs and fix the reported errors${NC}"
  echo -e "${YELLOW}Suggestion: Run './fix-jwt-issues.sh' to attempt automatic repair${NC}"
fi
