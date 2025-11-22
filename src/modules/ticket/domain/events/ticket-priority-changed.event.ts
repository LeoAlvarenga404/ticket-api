import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';
import { TicketPriority } from '../value-objects/ticket-priority';

export class TicketPriorityChangedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly ticket: Ticket,
    public readonly oldPriority: TicketPriority,
    public readonly newPriority: TicketPriority,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
