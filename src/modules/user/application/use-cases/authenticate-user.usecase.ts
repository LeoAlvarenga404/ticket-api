import { Either, left, right } from '@/core/either';
import { EmailNotVerifiedError } from '@/core/errors/email-not-verified.error';
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error';
import { User } from '../../domain/entities/user';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { PasswordHasher } from '../../domain/value-objects/password';
import { TokenGenerator } from '../../domain/value-objects/token-generator';

export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export type AuthenticateUserResponse = Either<
  InvalidCredentialsError | EmailNotVerifiedError,
  {
    user: User;
    accessToken: string;
  }
>;

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher,
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersRepository.findByEmail(normalizedEmail);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await user.verifyPassword(
      password,
      this.passwordHasher,
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    if (!user.isEmailVerified) {
      return left(new EmailNotVerifiedError());
    }

    user.updateLastLogin();
    await this.usersRepository.save(user);

    const accessToken = await this.tokenGenerator.generate({
      email: user.email,
      tenantId: user.agentProfile!.tenantId,
      isAgent: user.isAgent,
      userId: user.id.toString(),
    });

    return right({ user, accessToken });
  }
}
