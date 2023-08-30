import { makeGetUserProfileUseCase } from '@src/use-cases/factories/make-user-profile-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify();

	const getUserProfile = makeGetUserProfileUseCase();

	const profile = await getUserProfile.execute({
		userId: request.user.sub
	});
    
	return reply.status(200).send(profile);
}