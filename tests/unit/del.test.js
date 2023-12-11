const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/randomid').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/randomid')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Fragments cannot find id from readfragmentData', async () => {
    const deleted = await request(app)
      .delete('/v1/fragments/xxxxxxx')
      .auth('user1@email.com', 'password1');

    expect(deleted.statusCode).toBe(404);
  });

  test('successful delete with auth returns 200 and GET returns 404', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const fragmentData = JSON.parse(post.text).fragments;
    console.log(post.text);

    const get2 = await request(app)
      .get(`/v1/fragments/${fragmentData.id}/info`)
      .auth('user1@email.com', 'password1');

    expect(get2.status).toBe(200);
    expect(get2.body.status).toBe('ok');
    expect(get2.body.fragments).toEqual(fragmentData);

    const deleted = await request(app)
      .delete(`/v1/fragments/${fragmentData.id}`)
      .auth('user1@email.com', 'password1');

    expect(deleted.statusCode).toBe(200);

    const get = await request(app)
      .get(`/v1/fragments/${fragmentData.id}`)
      .auth('xxxx@email.com', 'xxx');
    expect(get.statusCode).toBe(401);

    const all_user = await request(app).get('/v1/fragments').auth('user2@email.com', 'password2');

    expect(all_user.body.fragments).toEqual([]);
  });
});
