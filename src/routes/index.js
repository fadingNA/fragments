// src/routes/index.js

const express = require('express');



// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

const authenticate  = require('../auth');

const { createSuccessResponse } = require('../response');

const { hostname } = require('os');



//const unneeded_variable = "This is a variable that is not used anywhere.";

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate.authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json({
    status: createSuccessResponse().status,
    author,
    // Use your own GitHub URL for this!
    githubUrl: 'https://github.com/fadingNA/fragments',
    version,
    // Include the hostname in the response
    hostname: hostname(),
  });
});





module.exports = router;
