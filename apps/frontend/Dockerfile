FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY components.json ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./

# Install dependencies
RUN npm install

# Copy source code
COPY app ./app
COPY components ./components
COPY hooks ./hooks
COPY lib ./lib
COPY public ./public

# Build the app
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./

# Set environment variables
ENV NODE_ENV production

# Expose web port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
