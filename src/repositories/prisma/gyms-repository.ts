import { Gym, Prisma } from '@prisma/client';
import { prisma } from '@src/lib/prisma';
import { GymsRepository, findManyNearbyParams } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
	ITEMS_PER_PAGE = 20;

	async findById(id: string) {
		const gym = await prisma.gym.findUnique({
			where: {
				id,
			},
		});

		return gym;
	}

	async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
		const gyms = await prisma.$queryRaw<Gym[]>`
			SELECT * from gyms WHERE
			( 6371 
				* acos( cos( radians(${latitude}) )
				* cos( radians( latitude ) )
				* cos( radians( longitude )
				- radians(${longitude}) )
				+ sin( radians(${latitude}) )
				* sin( radians( latitude ) ) ) 
			) <= 10
		`;

		return gyms;
	}

	async searchMany(query: string, page: number) {
		const gyms = await prisma.gym.findMany({
			where: {
				title: {
					contains: query
				},
			},
			take: this.ITEMS_PER_PAGE,
			skip: (page - 1) * this.ITEMS_PER_PAGE
		});

		return gyms;
	}

	async create(data: Prisma.GymUncheckedCreateInput) {
		const gym = await prisma.gym.create({
			data
		});

		return gym;
	}
}
