import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('GetUserProfile Use Case', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(userRepository);
	});

	it('should be able to get user profile', async () => {
		const createdUser = await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		});

		const { user } = await sut.execute({
			userId: createdUser.id
		});

		expect(user.id).toBeTruthy();
	});

	it('should not be able to get user profile with wrong id ', async () => {
		const response = sut.execute({
			userId: 'non-existing-id'
		});

		expect(response).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});