#!/bin/bash
# Script to debug npm install issues in Docker

# Set terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================================${NC}"
echo -e "${BLUE}    WeCare Docker NPM Install Debugging Tool           ${NC}"
echo -e "${BLUE}=======================================================${NC}"

# Check Docker and Docker Compose installation
echo -e "\n${YELLOW}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed or not in PATH!${NC}"
    exit 1
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}√ Docker is installed: ${DOCKER_VERSION}${NC}"
fi

# Check Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed or not in PATH!${NC}"
    exit 1
else
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}√ Docker Compose is installed: ${COMPOSE_VERSION}${NC}"
fi

# Check server resources
echo -e "\n${YELLOW}Checking system resources...${NC}"
MEM=$(free -h)
DISK=$(df -h /)
CPU=$(grep -c processor /proc/cpuinfo)

echo -e "${BLUE}Memory Information:${NC}\n$MEM"
echo -e "\n${BLUE}Disk Space:${NC}\n$DISK"
echo -e "\n${BLUE}CPU Cores:${NC} $CPU"

# Test network connectivity to npm registry
echo -e "\n${YELLOW}Testing network connectivity to npm registry...${NC}"
if curl --max-time 10 -s https://registry.npmjs.org/ > /dev/null; then
    echo -e "${GREEN}√ Connection to npm registry successful${NC}"
else
    echo -e "${RED}× Cannot connect to npm registry. Check network settings.${NC}"
fi

# Create test builder container to debug installation issues
echo -e "\n${YELLOW}Running test npm install in container...${NC}"
echo "This will attempt to install dependencies in a test container to isolate the issue."

SERVICE_TO_TEST=${1:-"backend"}

case "$SERVICE_TO_TEST" in
    "backend")
        CONTEXT_PATH="./apps/backend"
        echo -e "${BLUE}Testing backend npm install${NC}"
        ;;
    "frontend")
        CONTEXT_PATH="./apps/frontend"
        echo -e "${BLUE}Testing frontend npm install${NC}"
        ;;
    *)
        echo -e "${RED}Invalid service specified. Use 'backend' or 'frontend'${NC}"
        exit 1
        ;;
esac

echo -e "\n${YELLOW}Executing npm install in debug container...${NC}"

# Run a test container with full logging
docker run --rm -v "$(pwd)/${CONTEXT_PATH}:/app" \
  -w /app \
  --name wecare-npm-debug \
  node:20-alpine \
  sh -c "apk add --no-cache python3 make g++ git && npm install --verbose --no-audit --unsafe-perm=true 2>&1 | tee /app/npm-debug.log"

NPM_EXIT_CODE=$?

if [ $NPM_EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}√ npm install completed successfully in test container${NC}"
    echo -e "${BLUE}Debug log saved to ${CONTEXT_PATH}/npm-debug.log${NC}"
else
    echo -e "\n${RED}× npm install failed in test container with exit code $NPM_EXIT_CODE${NC}"
    echo -e "${BLUE}Error log saved to ${CONTEXT_PATH}/npm-debug.log${NC}"
    
    # Look for common errors
    if grep -q "ENOENT" "${CONTEXT_PATH}/npm-debug.log"; then
        echo -e "${YELLOW}Found file not found errors (ENOENT). Check file paths.${NC}"
    fi
    
    if grep -q "Z_BUF_ERROR" "${CONTEXT_PATH}/npm-debug.log"; then
        echo -e "${YELLOW}Found buffer errors. Consider increasing container memory.${NC}"
    fi
    
    if grep -q "ETIMEDOUT" "${CONTEXT_PATH}/npm-debug.log"; then
        echo -e "${YELLOW}Found timeout errors. Check network connection.${NC}"
    fi
    
    if grep -q "ERR_SOCKET_TIMEOUT" "${CONTEXT_PATH}/npm-debug.log"; then
        echo -e "${YELLOW}Found socket timeout errors. Check proxy settings or network.${NC}"
    fi
    
    if grep -q "out of memory" "${CONTEXT_PATH}/npm-debug.log"; then
        echo -e "${YELLOW}Found memory errors. Increase container memory limits.${NC}"
    fi
    
    if grep -q "Python" "${CONTEXT_PATH}/npm-debug.log" || grep -q "node-gyp" "${CONTEXT_PATH}/npm-debug.log"; then
        echo -e "${YELLOW}Found native module build errors. Add build dependencies.${NC}"
    fi
fi

echo -e "\n${BLUE}=======================================================${NC}"
echo -e "${BLUE}               Debugging Complete                      ${NC}"
echo -e "${BLUE}=======================================================${NC}"

echo -e "\n${YELLOW}Recommended actions:${NC}"
echo "1. Check npm-debug.log for specific errors"
echo "2. Ensure your Docker daemon has sufficient resources (memory, CPU, disk space)"
echo "3. Check network connectivity and proxy settings"
echo "4. Try using a package.json without a lockfile to resolve dependency conflicts"
echo "5. Consider adding '--network=host' to your Docker build command if behind corporate network"

# Make the generated log file readable
if [ -f "${CONTEXT_PATH}/npm-debug.log" ]; then
    chmod 644 "${CONTEXT_PATH}/npm-debug.log"
fi

exit $NPM_EXIT_CODE
