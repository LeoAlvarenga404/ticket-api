import { ConflictError } from '../entities/domain-error';

export class UserAlreadyExistsError extends ConflictError {
  readonly code = 'USER_ALREADY_EXISTS';
  constructor() {
    super('User already exists.');
  }
}
