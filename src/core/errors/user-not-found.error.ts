import { NotFoundError } from '../entities/domain-error';

export class UserNotFoundError extends NotFoundError {
  readonly code = 'USER_NOT_FOUND';
  constructor() {
    super('User not found.');
  }
}
