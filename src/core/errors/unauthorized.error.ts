import { UnauthorizedError as UnauthorizedEntityError } from '../entities/domain-error';

export class UnauthorizedError extends UnauthorizedEntityError {
  readonly code = 'UNAUTHORIZED';
  constructor(value?: string) {
    super(value ?? 'Unauthorized');
  }
}
