import { Either, left, right } from '@/core/either';
import { InvalidTransitionError } from '@/core/errors/invalid-transition.error';
import { TicketNotFoundError } from '@/core/errors/ticket-not-found.error';
import { UnauthorizedError } from '@/core/errors/unauthorized.error';
import { Ticket } from '../../domain/entities/ticket';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { AgentsRepository } from '@/modules/user/domain/repositories/agents.repository';
import { DomainEventDispatcher } from '@/core/events/domain-event-dispatcher';
import { AgentNotFoundError } from '@/core/errors/agent-not-found.error';
import { Permission } from '@/modules/user/domain/value-objects/agent-role';
import { EmailBody } from '../../domain/value-objects/email-body';

export interface CloseTicketRequest {
  ticketId: string;
  tenantId: string;
  closedByAgentId: string;
  resolution?: string;
}

export type CloseTicketResponse = Either<
  | TicketNotFoundError
  | UnauthorizedError
  | InvalidTransitionError
  | AgentNotFoundError,
  {
    ticket: Ticket;
  }
>;

export class CloseTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private agentRepository: AgentsRepository,
    private eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute({
    ticketId,
    tenantId,
    closedByAgentId,
    resolution,
  }: CloseTicketRequest): Promise<CloseTicketResponse> {
    const ticket = await this.ticketRepository.findById(ticketId, tenantId);

    if (!ticket) {
      return left(new TicketNotFoundError());
    }

    const agent = await this.agentRepository.findById(closedByAgentId);
    if (!agent) {
      return left(new AgentNotFoundError());
    }

    if (!agent.hasPermission(Permission.TICKET_CLOSE)) {
      return left(new UnauthorizedError());
    }

    if (resolution) {
      const emailBody = EmailBody.create(resolution);
      if (emailBody.isRight()) {
        ticket.addMessage(emailBody.value, {
          id: agent.id.toString(),
          type: 'agent',
        });
      }
    }

    const result = ticket.close();

    if (result.isLeft()) {
      return left(result.value);
    }

    await this.ticketRepository.save(ticket);

    await this.eventDispatcher.dispatchEventsForAggregate(ticket);

    return right({ ticket });
  }
}
