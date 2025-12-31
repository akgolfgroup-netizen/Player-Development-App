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

# Build info - Railway provides RAILWAY_GIT_COMMIT_SHA at build time
ARG RAILWAY_GIT_COMMIT_SHA
ARG RAILWAY_GIT_BRANCH
ARG BUILD_DATE
ENV REACT_APP_BUILD_SHA=${RAILWAY_GIT_COMMIT_SHA:-local}
ENV REACT_APP_BUILD_BRANCH=${RAILWAY_GIT_BRANCH:-local}
ENV REACT_APP_BUILD_DATE=${BUILD_DATE:-unknown}

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Log build info for debugging
RUN echo "=== BUILD INFO ===" && \
    echo "Commit SHA: $REACT_APP_BUILD_SHA" && \
    echo "Branch: $REACT_APP_BUILD_BRANCH" && \
    echo "Build Date: $REACT_APP_BUILD_DATE" && \
    echo "=================="

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
