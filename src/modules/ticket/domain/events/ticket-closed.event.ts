import { DomainEvent } from '@/core/events/domain-event';
import { Agent } from '../entities/agent';
import { Ticket } from '../entities/ticket';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class TicketClosedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly ticket: Ticket,
    public readonly closedBy: Agent | 'system',
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
