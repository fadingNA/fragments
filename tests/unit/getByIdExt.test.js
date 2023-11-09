const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/ext', () => {
    test('unauthenticated requests are denied', async () => { 
        const res = await request(app).get('/v1/fragments/124.md');
        expect(res.status).toBe(401);
    });

    test('request with invalid fragment id return 404', async () => {
        const res = (await request(app).get('/v1/fragments/123.md'));
        expect(res.status).toBe(404);
    });
});
