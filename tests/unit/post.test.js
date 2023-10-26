const request = require('supertest');
const app = require('../../src/app');

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
    expect(response.statusCode).toBe(200);
  });

  test('authenticated users can create a plain text fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const body = JSON.parse(res.text);
    expect(res.statusCode).toBe(200);
    expect(body.status).toBe('ok');
    expect(Object.keys(body.fragment)).toEqual([
      'id',
      'ownerId',
      'size',
      'type',
      'created',
      'updated',
    ]);
    expect(body.fragment.size).toEqual(data.byteLength);
    expect(body.fragment.type).toContain('text/plain');
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
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.text).fragment.size).toEqual(largeData.byteLength);
  });

  test('should include Location header after creating a new fragment', async () => {
    const data = Buffer.from('hello');
    const response = await request(app)
      .post('/v1/fragments')
      .auth(testUserEmail, testUserPassword)
      .set('Content-Type', 'text/plain')
      .send(data);
  
    expect(response.statusCode).toBe(200);
    expect(response.headers['location']).toMatch(/^http:\/\/localhost:8080\/v1\/fragments\/[a-zA-Z0-9-]+$/);
  });
});
