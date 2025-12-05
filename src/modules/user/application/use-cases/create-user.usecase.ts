import { Either, left, right } from '@/core/either';
import { User } from '../../domain/entities/user';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists.error';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { WeakPasswordError } from '@/core/errors/weak-password.error';
import { Password, PasswordHasher } from '../../domain/value-objects/password';
import { DomainEventDispatcher } from '@/core/events/domain-event-dispatcher';
import { EmailAddress } from '@/modules/ticket/domain/value-objects/email-address';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export type CreateUserResponse = Either<
  UserAlreadyExistsError | InvalidEmailError | WeakPasswordError,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher,
    private eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const validateEmail = EmailAddress.create(email);

    if (validateEmail.isLeft()) {
      return left(validateEmail.value);
    }

    const existingUser = await this.usersRepository.findByEmail(
      validateEmail.value.value,
    );

    if (existingUser) {
      return left(new UserAlreadyExistsError());
    }

    const passwordHash = await Password.create(password, this.passwordHasher);

    if (passwordHash.isLeft()) {
      return left(new WeakPasswordError(passwordHash.value));
    }

    const user = User.create({
      name,
      email: validateEmail.value.value,
      passwordHash: passwordHash.value.value,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepository.save(user);
    await this.eventDispatcher.dispatchEventsForAggregate(user);

    return right({
      user,
    });
  }
}
