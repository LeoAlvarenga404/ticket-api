import { Either, right } from '@/core/either';
import { TicketRepository } from '@/modules/ticket/domain/repositories/ticket.repository';
import { Ticket } from '@/modules/ticket/domain/entities/ticket';

type CreateTicketUseCaseRequest = {
  tenantId: string;
  title: string;
  description: string;
};

type CreateTicketUseCaseResponse = Either<
  null,
  {
    ticket: Ticket;
  }
>;

export class CreateTicketUseCase {
  constructor(private readonly TicketRepository: TicketRepository) {}

  async execute({
    tenantId,
    title,
    description,
  }: CreateTicketUseCaseRequest): Promise<CreateTicketUseCaseResponse> {
    const ticket = Ticket.create({
      tenantId,
      title,
      description,
    });

    await this.TicketRepository.save(ticket);

    return right({ ticket });
  }
}
