import { Ticket } from '../entities/ticket';

export abstract class TicketRepository {
  abstract save(ticket: Ticket): Promise<void>;
  abstract findById(id: string, tenantId: string): Promise<Ticket | null>;
  abstract list(): Promise<Ticket[]>;
}
