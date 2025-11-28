import { User } from '../domain/entities/user';
import { UsersRepository } from '../domain/repositories/users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    return this.items.find((t) => t.id.toString() === id) || null;
  }

  async findByEmail(email: string) {
    return this.items.find((t) => t.email === email) || null;
  }

  async save(user: User) {
    const index = this.items.findIndex(
      (t) => t.id.toString() === user.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = user;
    } else {
      this.items.push(user);
    }
  }
}
