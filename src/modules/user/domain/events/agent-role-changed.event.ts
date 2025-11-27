import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Agent } from '../entities/agent';
import { AgentRole } from '../value-objects/agent-role';

export class AgentRoleChangedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly agent: Agent,
    public readonly oldRole: AgentRole | null,
    public readonly newRole: AgentRole,
    public readonly changedBy: Agent,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.agent.id;
  }
}
