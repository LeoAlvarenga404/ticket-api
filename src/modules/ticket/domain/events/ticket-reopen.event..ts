import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';
import { Agent } from '@/modules/user/domain/entities/agent';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Customer } from '@/modules/customer/domain/entities/customer';

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
