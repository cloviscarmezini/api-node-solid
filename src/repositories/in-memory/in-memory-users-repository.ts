import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UserRepository {
	public items: User[] = [];

	async findByEmail(email: string) {
		const user = this.items.find(item=>item.email === email) ?? null;

		return user;
	}

	async findById(id: string) {
		const user = this.items.find(item=>item.id === id) ?? null;

		return user;
	}

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		};

		this.items.push(user);

		return user;
	}
}