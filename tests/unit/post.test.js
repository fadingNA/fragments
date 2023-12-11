const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');

describe('POST /v1/fragments - Data Transmission Debugging', () => {
  const testUserEmail = 'user1@email.com';
  const testUserPassword = 'password1';

  test('should send and receive the correct data', async () => {
    const data = Buffer.from('hello');
    const response = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(response.statusCode).toBe(201);
  });

  test('authenticated users can create a plain text fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const body = JSON.parse(res.text);
    expect(res.statusCode).toBe(201);
    expect(body.status).toBe('ok');
    expect(Object.keys(body.fragments)).toEqual([
      'id',
      'ownerId',
      'size',
      'type',
      'created',
      'updated',
    ]);
    expect(body.fragments.size).toEqual(data.byteLength);
    expect(body.fragments.type).toContain('text/plain');
  });
  test('should reject requests with invalid content type', async () => {
    const data = Buffer.from('hello');
    const response = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'invalid/type')
      .send(data);
    expect(response.statusCode).toBe(415);
  });
  test('should handle large data payloads', async () => {
    const largeData = Buffer.from('a'.repeat(5000)); // Creating a large buffer
    const response = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'text/plain')
      .send(largeData);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.text).fragments.size).toEqual(largeData.byteLength);
  });

  test('should include Location header after creating a new fragment', async () => {
    const data = Buffer.from('hello');
    const response = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(response.statusCode).toBe(201);
    expect(response.headers['location']).toMatch(
      /^http:\/\/localhost:8080\/v1\/fragments\/[a-zA-Z0-9-]+$/
    );
  });

  test('Handle content type text/* ', async () => {
    const textData = 'hello';
    const res = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'text/html')
      .send(textData);
    console.log(res.text);

    expect(res.statusCode).toBe(201);
    expect(res.header['content-type']).toMatch(/text\/html/);
    const json_response = JSON.parse(res.text);
    expect(json_response.status).toBe('ok');
  });
  test('Handle content type application/json ', async () => {
    const test_data = 'Nonthachai';
    const res = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'application/json')
      .send(test_data);

    expect(res.statusCode).toBe(201);
  });
  test('not Handle wrong type', async () => {
    const test_data = 'Nonthachai_2';
    const res = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'test/json')
      .send(test_data);

    expect(res.statusCode).toBe(415);
  });

  test('Handle content type image/png ', async () => {
    const imagePath = path.join(__dirname, '../../lib/CAA_logo.png');
    const test_img = fs.readFileSync(imagePath);
    const res = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'image/png')
      .send(test_img);
    console.log({
      res,
    });
    expect(res.statusCode).toBe(201);
  });

  test('Not accept content type image/svg ', async () => {
    const imagePath = path.join(__dirname, '../../lib/ChatGPT_logo.svg');
    const test_img = fs.readFileSync(imagePath);
    const res = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'image/svg')
      .send(test_img);

    expect(res.statusCode).toBe(415);
  });
});
