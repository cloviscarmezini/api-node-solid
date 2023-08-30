import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate CheckIn Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to validate check in', async () => {
		const checkIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});

		await sut.execute({
			checkInId: checkIn.id
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});

	it('should not be able to validate an inexistent check in', async () => {
		const checkInPromise = sut.execute({
			checkInId: '123'
		});

		expect(checkInPromise).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to validate the check in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 7, 25, 10, 0));

		const checkIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});

		const twentyOneMinutesInMs = 1000 * 60 * 21;

		vi.advanceTimersByTime(twentyOneMinutesInMs);

		const checkInPromise = sut.execute({
			checkInId: checkIn.id
		});

		expect(checkInPromise).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});