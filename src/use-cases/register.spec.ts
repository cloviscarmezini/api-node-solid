import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let userRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(userRepository);
	});

	it('should be able to register', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(user.id).toBeTruthy();
	});

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		});

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			user.password_hash
		);

		expect(isPasswordCorrectlyHashed).toBeTruthy();
	});

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@example.com';

		await sut.execute({
			name: 'John Doe',
			email,
			password: '123456'
		});

		const response = sut.execute({
			name: 'John Doe',
			email,
			password: '123456'
		});

		await expect(response).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});