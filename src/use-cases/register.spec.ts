import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {
	it('should be able to register', async () => {
		const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		});

		expect(user.id).toBeTruthy();
	});

	it('should hash user password upon registration', async () => {
		const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

		const { user } = await registerUseCase.execute({
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
		const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

		const email = 'johndoe@example.com';

		await registerUseCase.execute({
			name: 'John Doe',
			email,
			password: '123456'
		});

		const response = registerUseCase.execute({
			name: 'John Doe',
			email,
			password: '123456'
		});

		await expect(response).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});