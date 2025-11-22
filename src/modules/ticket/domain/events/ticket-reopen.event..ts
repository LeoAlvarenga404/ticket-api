import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';
import { Agent } from '../entities/agent';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Customer } from '../entities/customer';

export class TicketReopenedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly ticket: Ticket,
    public readonly reopenedBy?: Agent | Customer,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
