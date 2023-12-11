// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

const { Fragment } = require('../../src/model/data/fragment');

describe('GET /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

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
    const res = await request(app)
      .get('/v1/fragments/test-error')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toEqual(res.body.error.message);
  });
});

describe('GET /v1/fragments/expand', () => {
  test('should expand the fragment', async () => {
    const frag = [];
    for (let i = 0; i <= 2; i++) {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(`This is fragment ${i}`);
      const fragment = JSON.parse(postRes.text).fragments;
      frag.push(fragment);
    }

    const _res = await request(app)
      .get('/v1/fragments')
      .query({ expand: 1 })
      .auth('user1@email.com', 'password1');
    expect(_res.statusCode).toBe(200);
    expect(_res.body.status).toBe('ok');
    expect(Array.isArray(_res.body.fragments)).toBe(true);
    expect(_res.body.fragments).toEqual(frag);
  });

  describe('GET /v1/fragments with error', () => {
    beforeAll(() => {
      jest.spyOn(Fragment, 'byUser').mockImplementation(() => {
        throw new Error('Simulated error');
      });
    });
    afterAll(() => {
      Fragment.byUser.mockRestore();
    });
    test('should handle errors thrown by Fragment.byUser', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Internal Server Error');
    });
  });
});
