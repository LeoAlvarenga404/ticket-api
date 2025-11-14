import { Either, right } from 'src/core/either';
import { TicketRepository } from '../../domain/ticket.repository';
import { Ticket } from '../../domain/ticket.entity';

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
