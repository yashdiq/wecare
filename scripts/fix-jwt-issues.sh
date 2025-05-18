#!/bin/bash

# WeCare Docker Fix Script
# This script rebuilds the Docker environment with a focus on fixing JWT and user data flow issues

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====================================================${NC}"
echo -e "${YELLOW}       WeCare Docker Fix Script                     ${NC}"
echo -e "${YELLOW}====================================================${NC}"

# Stop all containers
echo -e "\n${BLUE}Stopping all containers...${NC}"
docker-compose down
echo -e "${GREEN}All containers stopped.${NC}"

# Clean Docker cache
echo -e "\n${BLUE}Cleaning Docker build cache...${NC}"
docker builder prune -f
echo -e "${GREEN}Docker cache cleaned.${NC}"

# Create fixed jwt.strategy.ts file
echo -e "\n${BLUE}Creating fixed JWT strategy file...${NC}"
cat > /tmp/jwt.strategy.ts << 'EOL'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from './prisma.service';
import { User } from './prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
    
    if (!process.env.JWT_SECRET) {
      this.logger.error('JWT_SECRET environment variable is not set!');
    } else {
      this.logger.log('JWT Strategy initialized with secret');
    }
  }

  async validate(payload: any): Promise<User> {
    try {
      this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`);
      
      if (!payload || !payload.sub) {
        this.logger.error('Invalid JWT payload: missing sub field');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      const user = await this.prismaService.user.findFirst({
        where: {
          id: payload.sub,
        },
      });
      
      if (!user) {
        this.logger.error(`User with id ${payload.sub} not found`);
        throw new UnauthorizedException('User not found');
      }
      
      this.logger.log(`User found: ${user.id} (${user.email})`);
      return user;
    } catch (error) {
      this.logger.error(`JWT validation error: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
EOL

# Copy the fixed file to the appropriate location
cp /tmp/jwt.strategy.ts ./apps/backend/libs/shared/src/jwt.strategy.ts
echo -e "${GREEN}Fixed JWT strategy file created.${NC}"

# Rebuild and start containers
echo -e "\n${BLUE}Rebuilding and starting containers...${NC}"
docker-compose up --build -d
echo -e "${GREEN}Containers rebuilt and started.${NC}"

# Wait for services to be available
echo -e "\n${BLUE}Waiting for services to be available...${NC}"
sleep 15

# Run the JWT debugging script
echo -e "\n${BLUE}Running JWT debugging script...${NC}"
./debug-jwt-flow.sh

echo -e "\n${YELLOW}====================================================${NC}"
echo -e "${YELLOW}       Fix Complete                                 ${NC}"
echo -e "${YELLOW}====================================================${NC}"
echo -e "\nIf issues persist, please check the logs for more details:"
echo -e "docker-compose logs api-gateway"
echo -e "docker-compose logs shift-service"
echo -e "docker-compose logs visit-service"
