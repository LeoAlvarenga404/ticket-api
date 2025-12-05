import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Agent } from '../entities/agent';
import { User } from '../entities/user';

export class PasswordChangedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(public readonly user: User) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
