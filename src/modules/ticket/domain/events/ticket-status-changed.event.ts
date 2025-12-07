import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';
import { TicketStatus } from '../value-objects/ticket-status';
import { Customer } from '@/modules/customer/domain/entities/customer';
import { Agent } from '@/modules/user/domain/entities/agent';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class TicketStatusChangedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly ticket: Ticket,
    public readonly oldStatus: TicketStatus,
    public readonly newStatus: TicketStatus,
    public readonly changedBy: Agent | Customer,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
