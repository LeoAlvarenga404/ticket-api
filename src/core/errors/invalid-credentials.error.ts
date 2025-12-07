import { UnauthorizedError } from '../entities/domain-error';

export class InvalidCredentialsError extends UnauthorizedError {
  readonly code = 'INVALID_CREDENTIALS';
  constructor() {
    super('Invalid credentials.');
  }
}
