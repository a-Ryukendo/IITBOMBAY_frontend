# ---- Build Stage ----
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Create proper nginx config without redirect loop
RUN rm /etc/nginx/conf.d/default.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3000;
    
    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=0";
    }
    
    location /static {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
