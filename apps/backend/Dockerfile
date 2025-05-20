# Build stage
FROM node:20-alpine AS builder

# Define build argument for which app to build
ARG APP_NAME=api-gateway

WORKDIR /app

# Install necessary build tools and increase npm timeout
RUN apk add --no-cache python3 make g++ git
# Increase npm timeout and set registry to official npm
ENV npm_config_registry=https://registry.npmjs.org/
ENV npm_config_fetch_timeout=600000
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000
ENV npm_config_network_timeout=300000

# Copy package.json first to leverage Docker caching
COPY package.json ./

# Install dependencies with verbose logging and increased memory
RUN npm install --no-audit --verbose --maxsockets=5 --unsafe-perm=true

# Copy the rest of the application
COPY prisma ./prisma/
COPY apps ./apps/
COPY libs ./libs/
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

# Generate Prisma client
RUN npx prisma generate

# Build the specific app
RUN npm run build ${APP_NAME}

# List the built files to verify the correct structure
RUN find dist -type f | sort
RUN echo "Build output for ${APP_NAME}"

# Production stage
FROM node:20-alpine AS runner

# Define build argument for which app to run
ARG APP_NAME=api-gateway

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY entrypoint.sh /app/entrypoint.sh

# Add wait-for-it script to handle service startup order
RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it /app/entrypoint.sh

# Set environment variables
ENV NODE_ENV production
ENV APP_NAME $APP_NAME

# Expose the appropriate port based on the app
EXPOSE 4200 4201 4202

# Use the enhanced entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
