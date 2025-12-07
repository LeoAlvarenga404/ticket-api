import { ConflictError } from '../entities/domain-error';

export class TickedClosedError extends ConflictError {
  readonly code = 'TICKET_CLOSED';
  constructor() {
    super('This ticket is closed');
  }
}
