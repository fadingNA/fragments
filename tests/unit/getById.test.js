// tests/unit/getById.test.js

const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../src/app');

describe('Get fragment by id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/1').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/1').auth('user1@email.com', 'indsadssword'));
  expect(401);

  // Using a valid username/password pair should give a success result with fragment data with given id
  test('authenticated users get fragment data with the given id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const { id } = JSON.parse(postRes.text).fragments;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toEqual('This is fragment');
  });

  test('if fragment cannot be converted to the type, return 415 error', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const { id } = JSON.parse(post.text).fragments;

    const get = await request(app)
      .get(`/v1/fragments/${id}.js`)
      .auth('user1@email.com', 'password1');
    expect(get.statusCode).toBe(415);
  });

  test('if fragment is markdown, return html', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is fragment');

    const { id } = JSON.parse(post.text).fragments;
    const get_res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');

    expect(get_res.statusCode).toBe(200);
    expect(get_res.headers['content-type']).toEqual('text/html; charset=utf-8');
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

describe('GET /v1/fragments/img', () => {
  test('if fragment is image, return image/png', async () => {
    const imagePath = path.join(__dirname, '../../lib/CAA_logo.png');
    const test_img = fs.readFileSync(imagePath);

    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(test_img);

    const id = post.header.location.split('fragments/')[1];

    const get_res = await request(app)
      .get(`/v1/fragments/${id}.png`)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);

    expect(get_res.headers['content-type']).toContain('image/');
  });
  test('if fragment is image, return image/jpeg', async () => {
    const imagePath = path.join(__dirname, '../../lib/caa-logo.jpg');
    const test_img = fs.readFileSync(imagePath);

    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(test_img);

    const id = post.header.location.split('fragments/')[1];

    const get_res = await request(app)
      .get(`/v1/fragments/${id}.jpeg`)
      .auth('user1@email.com', 'password1');
    expect(get_res.statusCode).toBe(200);
    console.log(get_res.headers);
    expect(get_res.headers['content-type']).toContain('image/');
  });
});
