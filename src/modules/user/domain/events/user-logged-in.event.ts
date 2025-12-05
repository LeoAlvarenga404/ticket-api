import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '../entities/user';

export class UserLoggedInEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly user: User,
    public readonly ip?: string,
    public readonly userAgent?: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
