import { PrismaGymsRepository } from '@src/repositories/prisma/gyms-repository';
import { FetchNearbyGymsUseCase } from '../fech-nearby-gyms';

export function makeFetchNearbyGymsUseCase() {
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new FetchNearbyGymsUseCase(gymsRepository);

	return useCase;
}