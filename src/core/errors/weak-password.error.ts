import { ValidationError } from '../entities/domain-error';

export class WeakPasswordError extends ValidationError {
  readonly code = 'WEAK_PASSWORD';
  constructor(value: string) {
    super(value ?? 'Weak password.');
  }
}
