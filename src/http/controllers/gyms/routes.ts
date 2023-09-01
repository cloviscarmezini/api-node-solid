import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@src/http/middlewares/verify-jwt';
import { nearby } from './nearby';
import { search } from './search';
import { create } from './create';

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT);

	app.post('/gyms/search', search);
	app.post('/gyms/nearby', nearby );

	app.post('/gyms', create);
}