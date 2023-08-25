import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search gym Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymUseCase(gymsRepository);
	});

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			id: 'gym-01',
			description: 'Javascript Gym',
			title: 'Javascript Gym',
			phone: '199999999',
			latitude: -22.7700828,
			longitude: -47.6350024
		});

		await gymsRepository.create({
			id: 'gym-02',
			description: 'Typescript Gym',
			title: 'Typescript Gym',
			phone: '199999999',
			latitude: -22.7700828,
			longitude: -47.6350024
		});

		const { gyms } = await sut.execute({
			query: 'Javascript',
			page: 1
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({title: 'Javascript Gym'})
		]);
	});

	it('should be to fetch paginated gyms search', async () => {
		for (let gymId = 1; gymId <= 22; gymId ++) {
			await gymsRepository.create({
				id: `gym-${gymId}`,
				description: 'descrição da gym',
				title: `Javascript Gym ${gymId}`,
				phone: '199999999',
				latitude: -22.7700828,
				longitude: -47.6350024
			});
		}

		const { gyms } = await sut.execute({
			query: 'Javascript',
			page: 2
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({title: 'Javascript Gym 21'}),
			expect.objectContaining({title: 'Javascript Gym 22'}),
		]);
	});
});