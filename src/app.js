// Define the express server and the middlewares that will be used.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { author, version } = require('../package.json');
const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});
const app = express();

// Calling app.use() means that every request will go through these middlewares in order.
app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

// Define simple health check route. If the server is running, it will return a 200 and the version number.
// if not server dies
app.get('/', (require, response) => {
  // User should'nt see this or cache this respond
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  response.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  response.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/fadingNA/fragments',
    version,
  });
});

// Add 404 middleware to handle unknown routes or any request that don't match the ones above.
app.use((request, response) => {
  response.status(404).json({
    status: 'error',
    error: {
      message: 'Not found',
      code: 404,
    },
  });
});

// add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message || 'Unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status >= 500) {
    logger.error(
      {
        error,
      },
      'Error processing request'
    );
  }

  // Send a response with the error information
  response.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});


// Export our 'app' so we can access it in server.js
module.exports = app;
