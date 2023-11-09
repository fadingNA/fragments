const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .post('/v1/fragments/:id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test("authenticated users get fragment's info data with the given id", async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');

    const fragmentData = JSON.parse(postRes.text).fragments;
    console.log(fragmentData.id);

    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentData.id}/info`)
      .auth('user1@email.com', 'password1');

    expect(getRes.status).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragments).toEqual(fragmentData);
  });

  test('If no such fragment exists, returns an HTTP 404', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');

    const getRes = await request(app)
      .get('/v1/fragments/noSuchID/info')
      .auth('user1@email.com', 'password1');

    expect(getRes.status).toBe(404);
  });
});
