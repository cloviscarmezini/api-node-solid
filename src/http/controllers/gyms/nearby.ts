import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchNearbyGymsUseCase } from '@src/use-cases/factories/make-fetch-nearby-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const nearbyGymBodySchema = z.object({
		latitude: z.number().refine(value=> {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine(value=> {
			return Math.abs(value) <= 180;
		})
	});

	const { latitude, longitude } = nearbyGymBodySchema.parse(request.body);

	const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase();
		
	const { gyms } = await fetchNearbyGymUseCase.execute({
		userLatitude: latitude,
		userLongitude: longitude
	});

	return reply.status(200).send({
		gyms
	});
}