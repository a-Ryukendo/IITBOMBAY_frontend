# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (ignore engine warnings)
RUN npm install --legacy-peer-deps --force

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

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
