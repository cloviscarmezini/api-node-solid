import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '@src/app';

describe('Authenticate (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test('it should be able to authenticate', async () => {
		await request(app.server).post('/users').send({
			name: 'John Doe',
			email: 'johndoe@exempla.com',
			password: '123456'
		});

		const response = await request(app.server).post('/sessions').send({
			email: 'johndoe@exempla.com',
			password: '123456'
		});


		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			token: expect.any(String)
		});
	});
});