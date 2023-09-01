import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@src/http/middlewares/verify-jwt';

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT);	
}