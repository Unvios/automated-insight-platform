# Multi-stage build for smaller image size
FROM docker.io/node:22.11.0 AS builder

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
COPY vite.config.ts ./

# Install dependencies using npm
RUN npm ci

# Copy source code and config files
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_LIVEKIT_URL

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_LIVEKIT_URL=${VITE_LIVEKIT_URL}

# Build the application
RUN npm run build

# Production stage with nginx
FROM docker.io/nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 