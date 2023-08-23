import { FastifyInstance } from 'fastify';
import { register } from '@src/http/controllers/register';
import { authenticate } from './controllers/authenticate';

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', register);
	app.post('/sessions', authenticate );
}