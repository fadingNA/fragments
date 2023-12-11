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

app.get('/v1/fragments/cpp55', (req, res) => {
  const error = new Error('Intentional server error for testing.');
  const errorResponse = createErrorResponse(error.status, error);
  res.status(error.status).json(errorResponse);
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

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
