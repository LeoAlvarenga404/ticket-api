import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';

export class TicketCreatedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(public readonly ticket: Ticket) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
