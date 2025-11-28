import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(userId: string): Promise<User | null>;

  abstract findByEmail(email: string): Promise<User | null>;
}
