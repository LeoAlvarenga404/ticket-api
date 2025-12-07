import { UnauthorizedError } from '../entities/domain-error';

export class InvalidTransitionError extends UnauthorizedError {
  readonly code = 'INVALID_TRANSITION';
  constructor() {
    super('Invalid transition');
  }
}
