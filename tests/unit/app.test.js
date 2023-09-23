const request = require('supertest');
const express = require('express');
const app = express();

// Import your error-handling middleware here
// ...

// Import the 404 middleware
app.use((req, res) => {
  // Pass along an error object to the error-handling middleware
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

describe('404 Middleware', () => {
  it('should return a 404 error for a non-existent route', async () => {
    const response = await request(app)
      .get('/non-existent-route') // Replace with a route that doesn't exist in your app
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });

  // Add more test cases if there are different scenarios that trigger the 404 middleware
});
