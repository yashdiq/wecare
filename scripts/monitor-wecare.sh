#!/bin/bash

# WeCare Monitoring Dashboard
# This script provides a simple monitoring dashboard for the WeCare application

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check container status
check_container() {
    local name=$1
    if docker ps -q --filter "name=$name" | grep -q .; then
        echo -e "${GREEN}Running${NC}"
    else
        echo -e "${RED}Stopped${NC}"
    fi
}

# Function to check HTTP endpoint
check_http() {
    local url=$1
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "2.."; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}Failed${NC}"
    fi
}

# Function to check database status
check_db() {
    if docker exec wecare-postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}Connected${NC}"
    else
        echo -e "${RED}Disconnected${NC}"
    fi
}

# Function to count database records
count_records() {
    local table=$1
    result=$(docker exec wecare-postgres psql -U postgres -d wecare -t -c "SELECT COUNT(*) FROM $table;")
    echo -e "${BLUE}$result${NC}"
}

# Function to check container logs for errors
check_logs() {
    local name=$1
    local errors=$(docker logs --tail 20 "$name" 2>&1 | grep -i "error\|exception\|fail" | wc -l)
    if [ "$errors" -eq 0 ]; then
        echo -e "${GREEN}No recent errors${NC}"
    else
        echo -e "${RED}$errors errors found${NC}"
    fi
}

# Clear screen and show header
clear
echo -e "${YELLOW}===================================================${NC}"
echo -e "${YELLOW}           WeCare Monitoring Dashboard             ${NC}"
echo -e "${YELLOW}===================================================${NC}"
echo -e "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')\n"

# Show container status
echo -e "${YELLOW}Container Status:${NC}"
echo -e "PostgreSQL:    $(check_container wecare-postgres)"
echo -e "API Gateway:   $(check_container wecare-api-gateway)"
echo -e "Shift Service: $(check_container wecare-shift-service)"
echo -e "Visit Service: $(check_container wecare-visit-service)"
echo -e "Frontend:      $(check_container wecare-frontend)\n"

# Show HTTP endpoint status
echo -e "${YELLOW}API Endpoints:${NC}"
echo -e "API Gateway: $(check_http http://localhost:4200/api)"
echo -e "Frontend:    $(check_http http://localhost:3000)\n"

# Show database status
echo -e "${YELLOW}Database Status:${NC}"
echo -e "Connection:   $(check_db)"
echo -e "Users Count:  $(count_records users)"
echo -e "Shifts Count: $(count_records shifts)"
echo -e "Visits Count: $(count_records visits)"
echo -e "Clients Count: $(count_records clients)\n"

# Show log errors
echo -e "${YELLOW}Recent Log Errors:${NC}"
echo -e "API Gateway:   $(check_logs wecare-api-gateway)"
echo -e "Shift Service: $(check_logs wecare-shift-service)"
echo -e "Visit Service: $(check_logs wecare-visit-service)"
echo -e "Frontend:      $(check_logs wecare-frontend)\n"

# Resource usage
echo -e "${YELLOW}Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo -e "\n${YELLOW}Dashboard Refreshed: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${YELLOW}Run './monitor-wecare.sh' again to refresh the dashboard${NC}"
