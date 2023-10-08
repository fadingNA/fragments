// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('Get fragment by id', () => {
    test('unauthenticated requests are denied', () => request(app).get('/v1/fragments/1').expect(401));

    test('incorrect credentials are denied', () =>
        request(app).get('/v1/fragments/1').auth('user1@email.com', 'incorrect_password'));
        expect(401);

    // Using a valid username/password pair should give a success result with fragment data with given id
	test('authenticated users get fragment data with the given id', async () => {
		const postRes = await request(app)
			.post('/v1/fragments')
			.auth('user1@email.com', 'password1')
			.set('Content-Type', 'text/plain')
			.send('This is fragment');
		const { id } = JSON.parse(postRes.text).fragment;

		const getRes = await request(app)
			.get(`/v1/fragments/${id}`)
			.auth('user1@email.com', 'password1');

		expect(getRes.statusCode).toBe(200);
		expect(getRes.text).toEqual('This is fragment');
	});
});