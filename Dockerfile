# Stage 1: Install dependencies
FROM node:18-alpine@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Setup the application
FROM node:18-alpine@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src 
COPY tests/.htpasswd ./tests/.htpasswd 
COPY package*.json ./
CMD ["npm", "run", "start"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3\
    CMD curl --silent --fail localhost:8080 || exit 1

# Stage 3: nginx web server to host the built site
FROM nginx:stable-alpine@sha256:62cabd934cbeae6195e986831e4f745ee1646c1738dbd609b1368d38c10c5519 AS deploy
COPY --from=builder /app/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --silent --fail localhost:80 || exit 1
