import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Agent } from '../entities/agent';

export class ChangedAgentRoleEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly targetAgent: Agent,
    public readonly changedBy: Agent,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.targetAgent.id;
  }
}
  