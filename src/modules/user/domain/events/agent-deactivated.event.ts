import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Agent } from '../entities/agent';

export class AgentDeactivatedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(
    public readonly agent: Agent,
    public readonly deactivatedBy: Agent | 'system',
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.agent.id;
  }
}
