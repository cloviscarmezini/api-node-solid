import { FastifyInstance } from 'fastify';

import { register } from '@src/http/controllers/register';
import { authenticate } from '@src/http/controllers/authenticate';
import { profile } from '@src/http/controllers/profile';

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', register);
	app.post('/sessions', authenticate );
	
	app.get('/me', profile );
}