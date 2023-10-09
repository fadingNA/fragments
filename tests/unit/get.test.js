// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('dscx@email.com', 'dqwdqwd').expect(401));


  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

});

describe('GET /v1/fragments/test-error', () => {
  test('simulated server error is caught and handled', async () => {
    const res = await request(app).get('/v1/fragments/test-error').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
    expect(res.body.error.message).toEqual(res.body.error.message);
  });
});
