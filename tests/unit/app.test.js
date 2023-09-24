// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');

describe('Error logging', () => {
  beforeAll(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => {}); 
    // jest.spyOn is a Jest function that allows us to spy on a function and mock its implementation.
  });

  afterAll(() => {
    logger.error.mockRestore();
    // Restore the original implementation of logger.error
  });

  test('code 500 or more than 500', async () => {
  
    const res = await request(app).get('/bad');

    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(logger.error).toHaveBeenCalledWith(
      {
        error: expect.anything(),
      },
      'Error processing request'
    );
  });

  test('code 400 or more than 400', async () => {
    // Trigger an error scenario that has a defined status of 400 or above.
    const res = await request(app).get('/bad');

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(logger.error).toHaveBeenCalledWith(
      {
        error: expect.anything(),
      },
      'Error processing request'
    );
  });
});
