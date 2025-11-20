import { DomainEvent } from '@/core/events/domain-event';
import { Ticket } from '../entities/ticket';
import { Message } from '../entities/message';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class MessageAddedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly ticket: Ticket,
    public readonly message: Message,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.ticket.id;
  }
}
