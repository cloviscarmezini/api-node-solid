import { PrismaGymsRepository } from '@src/repositories/prisma/gyms-repository';
import { SearchGymUseCase } from '../search-gym';

export function makeSearchGymsUseCase() {
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new SearchGymUseCase(gymsRepository);

	return useCase;
}
