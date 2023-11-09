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
CMD npm start
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3\
    CMD curl --silent --fail localhost:8080 || exit 1


