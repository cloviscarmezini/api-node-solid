import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-in-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInHistoryUseCase;

describe('Fetch User Check In History Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new FetchUserCheckInHistoryUseCase(checkInsRepository);
	});

	it('should be able to  fetch user check in history', async () => {
		await checkInsRepository.create({
			gym_id: 'gym_01',
			user_id: 'user_01'
		});

		await checkInsRepository.create({
			gym_id: 'gym_02',
			user_id: 'user_01'
		});

		await checkInsRepository.create({
			gym_id: 'gym_02',
			user_id: 'user_02'
		});

		const { checkIns } = await sut.execute({
			userId: 'user_01',
			page: 1
		});

		expect(checkIns).toHaveLength(2);
		
		expect(checkIns).toEqual([
			expect.objectContaining({
				gym_id: 'gym_01',
				user_id: 'user_01'
			}),
			expect.objectContaining({
				gym_id: 'gym_02',
				user_id: 'user_01'
			}),
		]);
	});

	it('should be able to  fetch paginated user check in history', async () => {
		for(let i = 1; i <= 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym_${i}`,
				user_id: 'user_01'
			});
		}

		const { checkIns } = await sut.execute({
			userId: 'user_01',
			page: 2
		});

		expect(checkIns).toHaveLength(2);

		expect(checkIns).toEqual([
			expect.objectContaining({
				gym_id: 'gym_21',
				user_id: 'user_01'
			}),
			expect.objectContaining({
				gym_id: 'gym_22',
				user_id: 'user_01'
			}),
		]);
	});
});