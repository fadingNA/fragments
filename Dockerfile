# Docker initial script for Fragments contaainer.

# use node version 20.5.0
FROM node:20.5.0

#FROM Instruction

LABEL maintainer="Nonthachai Plodthong <nplodthong@myseneca.ca>"
LABEL description="Fragments container node.js microservice"

#FROM ENV

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVER=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

#COPY Instruction
COPY package*.json /app/

#RUN Instruction
RUN npm install

#COPY Instruction
COPY ./src ./src

#Copy HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start
EXPOSE 8080