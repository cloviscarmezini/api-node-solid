import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		vi.useFakeTimers();

		gymsRepository.items.push({
			id: 'gym-01',
			description: 'teste',
			title: 'teste',
			phone: '199999999',
			latitude: new Decimal(-22.7700828),
			longitude: new Decimal(-47.6350024)
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.7700828,
			userLongitude: -47.6350024
		});

		expect(checkIn.id).toBeTruthy();
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2023, 7, 8, 0, 0));

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.7700828,
			userLongitude: -47.6350024
		});

		const response =  sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.7700828,
			userLongitude: -47.6350024
		});

		expect(response).rejects.toBeInstanceOf(Error);
	});

	it('should be able to check in twice in different days', async () => {
		vi.setSystemTime(new Date(2023, 7, 23, 0, 0));

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.7700828,
			userLongitude: -47.6350024
		});

		vi.setSystemTime(new Date(2023, 7, 24, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.7700828,
			userLongitude: -47.6350024
		});

		expect(checkIn.id).toBeTruthy();
	});

	it('should not be able to check in on distant gym', async () => {
		vi.setSystemTime(new Date(2023, 7, 8, 0, 0));

		const response =  sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.7700828,
			userLongitude: -47.6324275
		});

		expect(response).rejects.toBeInstanceOf(Error);
	});
});