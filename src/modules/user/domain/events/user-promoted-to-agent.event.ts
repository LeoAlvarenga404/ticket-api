import { DomainEvent } from '@/core/events/domain-event';
import { User } from '../entities/user';
import { AgentRole } from '../value-objects/agent-role';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class UserPromotedToAgentEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly user: User,
    public readonly tenantId: string,
    public readonly role: AgentRole,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
