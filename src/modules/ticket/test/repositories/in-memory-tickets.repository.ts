import { Ticket } from '../../domain/ticket.entity';
import { TicketRepository } from '../../domain/repositories/ticket.repository';

export class InMemoryTicketsRepository implements TicketRepository {
  public items: Ticket[] = [];

  async save(ticket: Ticket) {
    const index = this.items.findIndex(
      (t) => t.id.toString() === ticket.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = ticket;
    } else {
      this.items.push(ticket);
    }
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.items.find((t) => t.id.toString() === id) || null;
  }

  async list(): Promise<Ticket[]> {
    return [...this.items];
  }
}
