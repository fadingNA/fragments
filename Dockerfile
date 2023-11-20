# Stage 1: Install dependencies
FROM node:20.2.0@sha256:bc56c8da9f3e892e2697e37db775c42c52abee85c6c035f21587fa509be76d76 AS dependencies
LABEL maintainer="Nonthachai Plodthong | nplodthong@myseneca.ca" \ 
    description="Dockerfile for Fragments UI"
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Setup the application
FROM node:20.2.0@sha256:bc56c8da9f3e892e2697e37db775c42c52abee85c6c035f21587fa509be76d76 AS builder
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src 
COPY tests/.htpasswd ./tests/.htpasswd 
COPY package*.json ./
CMD ["npm", "start"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3\
    CMD curl --silent --fail localhost:8080 || exit 1


