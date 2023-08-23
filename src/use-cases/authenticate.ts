import { compare } from 'bcryptjs';
import { UserRepository } from '@src/repositories/users-repository';
import { User } from '@prisma/client';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
	user: User
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UserRepository){}

	async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if(!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordsMatches = await compare(password, user.password_hash);

		if(!doesPasswordsMatches) {
			throw new InvalidCredentialsError();
		}

		return {
			user
		};
	}
}