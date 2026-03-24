# ---- Build Stage ----
FROM node:18-alpine AS build
WORKDIR /app

# Copy only package files first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies with timeout and retry
RUN npm install --prefer-offline --no-audit

# Copy source code
COPY . .

# Build app
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Create a health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
