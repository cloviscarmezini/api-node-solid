import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@src/repositories/check-ins-repository';
import { GymsRepository } from '@src/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@src/utils/get-distance-between-coordinates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-of-check-ins-error';

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckInUseCaseResponse {
	checkIn: CheckIn
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository
	){}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if(!gym) {
			throw new ResourceNotFoundError();
		}

		const distanceBetweenUserAndGym = getDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude
			}, {
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber()
			}
		);

		const MAX_DISTANCE_IN_KILOMETERS = 100 / 1000; // 100 metros -> 100 metros / 1km (1000 metros);

		if(distanceBetweenUserAndGym > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId,  new Date());

		if(checkInOnSameDay) {
			throw new MaxNumbersOfCheckInsError();
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		});

		return {
			checkIn
		};
	}
}