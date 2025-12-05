import { Either, left, right } from '@/core/either';
import {
  StatusProps,
  TicketStatus,
} from '../../domain/value-objects/ticket-status';
import { TicketNotFoundError } from '@/core/errors/ticket-not-found.error';
import { InvalidTransitionError } from '@/core/errors/invalid-transition.error';
import { Ticket } from '../../domain/entities/ticket';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { DomainEventDispatcher } from '@/core/events/domain-event-dispatcher';

export interface ChangeTicketStatusRequest {
  ticketId: string;
  tenantId: string;
  newStatus: StatusProps;
  changedByAgentId: string;
}

export type ChangeTicketStatusResponse = Either<
  TicketNotFoundError | InvalidTransitionError,
  {
    ticket: Ticket;
  }
>;

export class ChangeTicketStatusUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute({
    ticketId,
    tenantId,
    newStatus,
    changedByAgentId,
  }: ChangeTicketStatusRequest): Promise<ChangeTicketStatusResponse> {
    const ticket = await this.ticketRepository.findById(ticketId, tenantId);

    if (!ticket) {
      return left(new TicketNotFoundError());
    }

    const result = ticket.changeStatus(
      TicketStatus.create(newStatus).value,
      changedByAgentId,
    );

    if (result.isLeft()) {
      return left(result.value);
    }

    await this.ticketRepository.save(ticket);
    await this.eventDispatcher.dispatchEventsForAggregate(ticket);

    return right({ ticket });
  }
}
