// Define the express server and the middlewares that will be used.
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authenticate = require('./auth');
const helmet = require('helmet');

const compression = require('compression');
const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});
const app = express();

const { createErrorResponse } = require('./response');

// Use gzip/deflate compression middleware

// Calling app.use() means that every request will go through these middlewares in order.
app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

// set up passport authentication
passport.use(authenticate.strategy());
app.use(passport.initialize());

// Define our routes
app.use('/', require('./routes'));

app.get('/bad', (req, res, next) => {
  const error = new Error('testing purpose message');
  error.status = 502; // error code for bad gateway
  next(error);
});

// This is just for testing purposes. Remove or comment it out after testing.
app.get('/v1/fragments/test-error', (req, res) => {
  const error = new Error('Intentional server error for testing.');
  const errorResponse = createErrorResponse(error.status, error);
  res.status(error.status).json(errorResponse);
});

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message;
  if (error.status >= 500) {
    // cannot use status because it might set to 500 by default
    logger.error(
      {
        error,
      },
      'Error processing request'
    );
  }
  response.status(status).json(createErrorResponse(status, message));
});

// Export our 'app' so we can access it in server.js
module.exports = app;
