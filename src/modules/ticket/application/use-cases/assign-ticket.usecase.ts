import { AgentNotFoundError } from '@/core/errors/agent-not-found.error';
import { InactiveAgentError } from '@/core/errors/inactive-agent.error';
import { TenantMismatchError } from '@/core/errors/tenant-mismatch.error';
import { UnauthorizedError } from '@/core/errors/unauthorized.error';
import { Ticket } from '../../domain/entities/ticket';
import { TicketNotFoundError } from '@/core/errors/ticket-not-found.error';
import { Either, left, right } from '@/core/either';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { AgentsRepository } from '@/modules/user/domain/repositories/agents.repository';
import { DomainEventDispatcher } from '@/core/events/domain-event-dispatcher';
import { Permission } from '@/modules/user/domain/value-objects/agent-role';

export interface AssignTicketRequest {
  ticketId: string;
  agentId: string;
  tenantId: string;
  assignedByAgentId: string;
}

export type AssignTicketResponse = Either<
  | TicketNotFoundError
  | AgentNotFoundError
  | InactiveAgentError
  | TenantMismatchError
  | UnauthorizedError,
  {
    ticket: Ticket;
  }
>; 

export class AssignTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private agentRepository: AgentsRepository,
    private eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute({
    ticketId,
    tenantId,
    agentId,
    assignedByAgentId,
  }: AssignTicketRequest): Promise<AssignTicketResponse> {
    const ticket = await this.ticketRepository.findById(ticketId, tenantId);

    if (!ticket) {
      return left(new TicketNotFoundError());
    }

    const agent = await this.agentRepository.findById(agentId);

    if (!agent) {
      return left(new AgentNotFoundError());
    }

    const assignedBy = await this.agentRepository.findById(assignedByAgentId);

    if (!assignedBy) {
      return left(new AgentNotFoundError());
    }

    if (!assignedBy.hasPermission(Permission.TICKET_ASSIGN)) {
      return left(new UnauthorizedError());
    }

    const result = ticket.assignTo(agent);

    if (result.isLeft()) {
      return left(result.value);
    }

    await this.ticketRepository.save(ticket);

    await this.eventDispatcher.dispatchEventsForAggregate(ticket);

    return right({ ticket });
  }
}
