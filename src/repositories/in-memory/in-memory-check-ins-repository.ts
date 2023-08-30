import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {

	async findById(id: string) {
		const checkIn = this.items
			.find(checkIn=> checkIn.id === id);

		if(!checkIn) {
			return null;
		}

		return checkIn;
	}

	async save(checkIn: CheckIn) {
		const checkInIndex = this.items
			.findIndex(checkIn=> checkIn.id === checkIn.id);

		if(checkInIndex >= 0) {
			this.items[checkInIndex] = checkIn;
		}

		return checkIn;
	}

	async countByUserId(userId: string) {
		return this.items
			.filter(checkIn=> checkIn.user_id === userId)
			.length;
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items
			.filter(checkIn=> checkIn.user_id === userId)
			.slice((page - 1) * 20, page * 20);
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');

		const checkInOnSameDate = this.items.find(checkIn=> {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate = checkInDate.endOf('date').isAfter(startOfTheDay) && checkInDate.startOf('date').isBefore(endOfTheDay);

			return isOnSameDate && checkIn.user_id === userId;
		});

		if(checkInOnSameDate) {
			return checkInOnSameDate;
		}
		
		return null;
	}

	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		};

		this.items.push(checkIn);

		return checkIn;
	}
}