FROM node:20-alpine AS builder

# Define build argument for which app to build
ARG APP_NAME=api-gateway

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY prisma ./prisma/
COPY apps ./apps/
COPY libs ./libs/
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build the specific app
RUN npm run build ${APP_NAME}

FROM node:20-alpine AS runner

# Define build argument for which app to run
ARG APP_NAME=api-gateway

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV production

# Expose the appropriate port based on the app
EXPOSE 4200 4201 4202

# Run migrations and start the specific app
CMD npx prisma migrate deploy && node dist/apps/${APP_NAME}/src/main
