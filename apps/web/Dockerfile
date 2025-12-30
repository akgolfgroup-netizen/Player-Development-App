# =============================================================================
# IUP Golf Academy Web - Production Dockerfile
# Multi-stage build with Nginx for serving
# =============================================================================

# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Set production API URL
ENV REACT_APP_API_URL=https://iup-golf-backend-production.up.railway.app/api/v1

# Disable CI mode to allow build with ESLint warnings
ENV CI=false

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Cache bust to force rebuild (update date to invalidate)
ARG BUILD_DATE=2025-12-30T05:10:00
RUN echo "Build date: $BUILD_DATE"

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
