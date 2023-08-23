import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let userRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(userRepository);
	});

	it('should be able to authenticate', async () => {
		await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		});

		const { user } = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(user.id).toBeTruthy();
	});

	it('should not be able to authenticate with wrong email ', async () => {
		const response = sut.execute({
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(response).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with wrong password ', async () => {
		await userRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6)
		});

		const response = sut.execute({
			email: 'johndoe@example.com',
			password: '112233'
		});

		expect(response).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});