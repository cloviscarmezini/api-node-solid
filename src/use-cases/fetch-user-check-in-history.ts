import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@src/repositories/check-ins-repository';

interface FetchUserCheckInHistoryUseCaseRequest {
    userId: string;
	page: number;
}

interface FetchUserCheckInHistoryUseCaseResponse {
	checkIns: CheckIn[]
}

export class FetchUserCheckInHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository){}

	async execute({ userId, page }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

		return {
			checkIns
		};
	}
}