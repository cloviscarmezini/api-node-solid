import { FastifyInstance } from 'fastify';
import { register } from '@src/http/controllers/register';

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', register);
}