import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
}
