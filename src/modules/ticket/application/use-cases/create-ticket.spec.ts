import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryTicketsRepository } from '../../test/repositories/in-memory-ticketS.repository';
import { CreateTicketUseCase } from './create-ticket';

let inMemoryTicketsRepository: InMemoryTicketsRepository;
let sut: CreateTicketUseCase;

describe('Create Ticket', () => {
  beforeEach(() => {
    inMemoryTicketsRepository = new InMemoryTicketsRepository();
    sut = new CreateTicketUseCase(inMemoryTicketsRepository);
  });

  it('should be able to create a ticket', async () => {
    const response = await sut.execute({
      title: 'example-title',
      description: 'example-description',
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryTicketsRepository.items[0].id).toBeInstanceOf(UniqueEntityID)
  });
});
