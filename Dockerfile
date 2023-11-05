# Stage 1: Build Node.js application
# Start from a Node.js 18 image
FROM node:18-alpine3.17@sha256:a136ed7b0df71082cdb171f36d640ea3b392a5c70401c642326acee767b8c540 AS build

# Meta details
LABEL maintainer="Nonthachai Plodthong <nplodthong@myseneca.ca>" \
      description="Fragments container node.js microservice"

# Set environment variables
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false \
    NODE_ENV=production

# Define the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json /app/

# Install only the production dependencies
RUN npm ci --only=production

# Copy the source code and necessary files
COPY src ./src
COPY tests/.htpasswd ./tests/.htpasswd

# Set the correct permissions
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Expose the port the app runs on
EXPOSE 8080

# Healthcheck for the service
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:${PORT} || exit 1

# Start the application
CMD ["node", "src/index.js"]

# Stage 2: Setup NGINX
FROM nginx:alpine

# Copy the build from the previous stage
COPY --from=build /app /usr/share/nginx/html

# Copy the custom NGINX configuration file (assuming you have one)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port NGINX is running on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
