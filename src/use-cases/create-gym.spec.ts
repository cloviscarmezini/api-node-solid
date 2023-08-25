import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create gym Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it('should be able to create a gym', async () => {
		const { gym } = await sut.execute({
			description: 'teste',
			title: 'teste',
			phone: '199999999',
			latitude: -22.7700828,
			longitude: -47.6350024
		});

		expect(gym.id).toBeTruthy();
	});
});