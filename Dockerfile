# Stage 1: Dependencies
FROM node:18-alpine3.17@sha256:a136ed7b0df71082cdb171f36d640ea3b392a5c70401c642326acee767b8c540 AS dependencies

# Meta details
LABEL maintainer="Nonthachai Plodthong <nplodthong@myseneca.ca>" \
    description="Fragments container node.js microservice"

# Environment variables
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false \
    NODE_ENV=production

WORKDIR /app
# Copy package.json and source code
COPY package*.json /app 
COPY   ./src ./src 
COPY   ./tests/.htpasswd ./tests/.htpasswd 

RUN npm install
# Stage 2: Production
FROM node:18-alpine3.17@sha256:a136ed7b0df71082cdb171f36d640ea3b392a5c70401c642326acee767b8c540 AS builder
WORKDIR /app
# Copy node_modules from dependencies stage
COPY --from=dependencies /app /app
# Copy source code
COPY . .

RUN chown -R node:node /app
# Start the container by running our server
USER root
RUN npm ci --only=production
USER node
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 

