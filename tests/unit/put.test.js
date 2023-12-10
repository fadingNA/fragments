const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  test('unauthenticated requests are denied', () => {
    return request(app).put('/v1/fragments/302930').expect(401);
  });
});

describe('PUT /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const put = await request(app)
      .put('/v1/fragments/302930')
      .auth('fake@example.com', 'password1');
    expect(put.statusCode).toBe(401);
  });

  test('authenticated requests with invalid content type are denied', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');

    console.log({
      postRes,
    });
    const { id } = JSON.parse(postRes.text).fragments;
    console.log('After Id', id);

    const put = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('hello updated');

    expect(put.statusCode).toBe(200);
  });

});
