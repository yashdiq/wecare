# First stage: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache libc6-compat python3 make g++ git

# Set npm configuration for better reliability
ENV npm_config_registry=https://registry.npmjs.org/
ENV npm_config_fetch_timeout=600000
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000
ENV npm_config_network_timeout=300000

# Copy package.json files
COPY package.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY components.json ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./

# Install dependencies with verbose logging
RUN npm install --no-audit --verbose --maxsockets=5 --unsafe-perm=true

# Second stage: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all node_modules and config files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/next.config.js ./
COPY --from=deps /app/tsconfig.json ./
COPY --from=deps /app/components.json ./
COPY --from=deps /app/postcss.config.js ./
COPY --from=deps /app/tailwind.config.ts ./

# Copy source code
COPY app ./app
COPY components ./components
COPY hooks ./hooks
COPY lib ./lib
# Create public directory
RUN mkdir -p ./public

# Set environment variable for Next.js to build without telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app (without turbopack in Docker)
RUN npm run build -- --no-lint

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the necessary files from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Expose web port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
