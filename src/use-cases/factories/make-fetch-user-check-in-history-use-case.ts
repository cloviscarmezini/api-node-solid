import { FetchUserCheckInHistoryUseCase } from '../fetch-user-check-in-history';
import { PrismaCheckInsRepository } from '@src/repositories/prisma/check-ins-repository';

export function makeFetchUserCheckInHistoryUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const useCase = new FetchUserCheckInHistoryUseCase(checkInsRepository);

	return useCase;
}