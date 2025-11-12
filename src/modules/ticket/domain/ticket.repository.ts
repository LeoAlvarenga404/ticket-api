import { Ticket } from './ticket.entity';

export abstract class TicketRepository {
  abstract save(ticket: Ticket): Promise<void>;
  abstract findById(id: string): Promise<Ticket | null>;
  abstract list(): Promise<Ticket[]>;
}
