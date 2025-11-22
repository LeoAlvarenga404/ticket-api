import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';
import { Agent } from '../entities/agent';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class TicketAssignedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly ticket: Ticket,
    public readonly agent: Agent,
    public readonly assignedBy?: Agent,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
