import { ValidationError } from '../entities/domain-error';

export class InvalidEmailError extends ValidationError {
  readonly code = 'INVALID_EMAIL';
  constructor() {
    super('Invalid Email.');
  }
}
