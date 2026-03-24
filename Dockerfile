# ---- Build Stage ----
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine

# Set up nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
events {
    worker_connections 1024;
}

http {
    server {
        listen 3000;
        root /usr/share/nginx/html;
        index index.html index.htm;

        location / {
            try_files \$uri \$uri/ /index.html;
        }

        error_page 404 /index.html;
    }
}
EOF

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
