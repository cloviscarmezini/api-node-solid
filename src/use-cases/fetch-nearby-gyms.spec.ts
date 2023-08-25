import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fech-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby gyms Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			id: 'gym-01',
			description: 'HotFit Academia',
			title: 'HotFit Academia',
			phone: '199999999',
			latitude: -22.7700828,
			longitude: -47.6350024
		});

		await gymsRepository.create({
			id: 'gym-02',
			description: 'Objetivo Gym',
			title: 'Objetivo Gym',
			phone: '199999999',
			latitude: -22.7673522,
			longitude: -47.6412602
		});

		await gymsRepository.create({
			id: 'gym-03',
			description: 'SportWay Gym',
			title: 'SportWay Gym',
			phone: '199999999',
			latitude: -22.7562733,
			longitude: -47.6290749
		});

		await gymsRepository.create({
			id: 'gym-04',
			description: 'SmartFit Shops Gym',
			title: 'SmartFit Shops Gym',
			phone: '199999999',
			latitude: -22.6911217,
			longitude: -47.7285701
		});

		const { gyms } = await sut.execute({
			userLatitude: -22.7700828,
			userLongitude: -47.6350024
		});

		expect(gyms).toHaveLength(3);
		expect(gyms).toEqual([
			expect.objectContaining({title: 'HotFit Academia'}),
			expect.objectContaining({title: 'Objetivo Gym'}),
			expect.objectContaining({title: 'SportWay Gym'}),
		]);
	});
});