const request = require('supertest');

const app = require('../../src/app');


describe('DELETE /v1/fragments', () => {
	// If the request is missing the Authorization header, it should be forbidden
	test('unauthenticated requests are denied', () =>
		request(app).delete('/v1/fragments/randomid').expect(401));

	// If the wrong username/password pair are used (no such user), it should be forbidden
	test('incorrect credentials are denied', () =>
		request(app)
			.delete('/v1/fragments/randomid')
			.auth('invalid@email.com', 'incorrect_password')
			.expect(401));

	// No fragment with the given id
	test('if no id found, returns 404 error', async () => {
		const deleted = await request(app)
			.delete('/v1/fragments/randomid')
			.auth('user1@email.com', 'password1');

		expect(deleted.statusCode).toBe(404);
	});

	// after deleted successfully, it returns 200, and GET returns 404 with the id
	test('successful delete with auth returns 200 and GET returns 404', async () => {
		const post = await request(app)
			.post('/v1/fragments')
			.auth('xx@email.com', 'xx')
			.set('Content-Type', 'text/plain')
			.send('This is fragment');
		const fragmentId = JSON.parse(post.text).fragments.id;

		const deleted = await request(app)
			.delete(`/v1/fragments/${fragmentId}`)
			.auth('xx@email.com', 'xx');

		expect(deleted.statusCode).toBe(200);

		const get = await request(app)
			.get(`/v1/fragments/${fragmentId}`)
			.auth('xxxx@email.com', 'xxx');
		expect(get.statusCode).toBe(404);

		const all_user = await request(app).get('/v1/fragments').auth('user2@email.com', 'password2');

		expect(all_user.body.fragments).toEqual([]);
	});
});