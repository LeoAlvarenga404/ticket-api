import { NotFoundError } from '../entities/domain-error';

export class TicketNotFoundError extends NotFoundError {
  readonly code = 'TICKET_NOT_FOUND';
  constructor() {
    super('Ticket not found.');
  }
}
