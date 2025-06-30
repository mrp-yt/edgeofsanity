FROM node:18-alpine

# Install Nginx and Supervisor
RUN apk add --no-cache nginx supervisor

# Create Nginx log directory
RUN mkdir -p /var/log/nginx

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Copy frontend files
COPY index.html /usr/share/nginx/html/index.html
COPY mounts.html /usr/share/nginx/html/mounts.html
COPY pets.html /usr/share/nginx/html/pets.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js
COPY favicon.ico /usr/share/nginx/html/favicon.ico

# Copy backend files
WORKDIR /app/backend
COPY backend/package.json ./
COPY backend/server.js ./
RUN npm install
RUN touch mounts.json && chmod 666 mounts.json

# Expose ports
EXPOSE 80
EXPOSE 3000

# Start Supervisor
CMD ["supervisord", "-c", "/etc/supervisord.conf"]