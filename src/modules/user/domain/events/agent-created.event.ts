import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Agent } from '../entities/agent';

export class AgentCreatedEvent implements DomainEvent {
  public occurredAt: Date;

  constructor(public readonly agent: Agent) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.agent.id;
  }
}
