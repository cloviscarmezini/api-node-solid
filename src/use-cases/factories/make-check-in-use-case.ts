import { PrismaGymsRepository } from '@src/repositories/prisma/gyms-repository';
import { PrismaCheckInsRepository } from '@src/repositories/prisma/check-ins-repository';
import { CheckInUseCase } from '../check-in';

export function makeCheckInUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();
	const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);

	return useCase;
}