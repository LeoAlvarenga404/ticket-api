import { AuthorizationError } from '../entities/domain-error';

export class EmailNotVerifiedError extends AuthorizationError {
  readonly code = 'EMAIL_NOT_VERIFIED';
  constructor(email?: string) {
    super(`Email not verified: ${email}`);
  }
}
