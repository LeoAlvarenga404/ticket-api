import { Either, left, right } from '@/core/either';
import {
  AgentRole,
  AgentRoles,
  Permission,
} from '../../domain/value-objects/agent-role';
import { UnauthorizedError } from '@/core/errors/unauthorized.error';
import { AgentNotFoundError } from '@/core/errors/agent-not-found.error';
import { AgentsRepository } from '../../domain/repositories/agents.repository';
import { DomainEventDispatcher } from '@/core/events/domain-event-dispatcher';
import { Agent } from '../../domain/entities/agent';

export interface ChangeAgentRoleRequest {
  agentId: string;
  changedByAgentId: string;
  newRoleName: AgentRoles;
}

export type ChangeAgentRoleResponse = Either<
  AgentNotFoundError | UnauthorizedError,
  {
    agent: Agent
  }
>;

export class ChangeAgentRoleUseCase {
  constructor(
    private agentRepository: AgentsRepository,
    private eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute({
    agentId,
    changedByAgentId,
    newRoleName,
  }: ChangeAgentRoleRequest): Promise<ChangeAgentRoleResponse> {
    const agent = await this.agentRepository.findById(agentId);

    if (!agent) {
      return left(new AgentNotFoundError());
    }

    const changedBy = await this.agentRepository.findById(changedByAgentId);

    if (!changedBy) {
      return left(new AgentNotFoundError());
    }

    if (!changedBy.hasPermission(Permission.AGENT_MANAGE_ROLES)) {
      return left(new UnauthorizedError());
    }

    const newRole = AgentRole.create(newRoleName);

    agent.changeRole(newRole, changedBy);

    await this.agentRepository.save(agent);

    await this.eventDispatcher.dispatchEventsForAggregate(agent);

    return right({
        agent
    })
  }
}
