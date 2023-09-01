import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeSearchGymsUseCase } from '@src/use-cases/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const createGymBodySchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	});

	const { q, page } = createGymBodySchema.parse(request.body);

	const searchGymUseCase = makeSearchGymsUseCase();
		
	const { gyms } = await searchGymUseCase.execute({
		query: q,
		page
	});

	return reply.status(200).send({
		gyms
	});
}