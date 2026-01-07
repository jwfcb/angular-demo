# Multi-stage build for Angular 19 app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:1.27-alpine

LABEL org.opencontainers.image.source=https://github.com/jwfcb/angular-demo
LABEL org.opencontainers.image.description="Angular 19 Demo App"
LABEL org.opencontainers.image.licenses=MIT

# Create non-root user directories
USER 0
RUN mkdir -p /tmp/nginx/client_temp /tmp/nginx/proxy_temp /tmp/nginx/fastcgi_temp \
             /tmp/nginx/uwsgi_temp /tmp/nginx/scgi_temp /var/cache/nginx /var/run && \
    chown -R 101:101 /tmp/nginx /var/cache/nginx /var/run /usr/share/nginx/html && \
    chmod -R 755 /tmp/nginx /var/cache/nginx /var/run

USER 101

# Copy custom nginx config
COPY --chown=101:101 nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder stage
COPY --from=builder --chown=101:101 /app/dist/angular-demo/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
