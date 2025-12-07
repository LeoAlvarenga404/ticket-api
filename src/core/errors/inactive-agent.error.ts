import { UnauthorizedError } from '../entities/domain-error';

export class InactiveAgentError extends UnauthorizedError {
  readonly code = 'INACTIVE_AGENT';
  constructor() {
    super('Agent inactive.');
  }
}
