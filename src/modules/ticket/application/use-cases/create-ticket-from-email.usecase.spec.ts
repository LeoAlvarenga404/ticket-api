import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Customer } from '@/modules/customer/domain/entities/customer';
import { InMemoryTicketsRepository } from '../../test/repositories/in-memory-tickets.repository';
import {
  CreateTicketFromEmailRequest,
  CreateTicketFromEmailUseCase,
} from './create-ticket-from-email.usecase';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { EmailBodyEmptyError } from '@/core/errors/email-body-empty.error';

describe('CreateTicketFromEmailUseCase', () => {
  let ticketRepository: InMemoryTicketsRepository;
  let sut: CreateTicketFromEmailUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketsRepository();
    sut = new CreateTicketFromEmailUseCase(ticketRepository);
  });

  it('should be able to create a ticket from email', async () => {
    const customer = Customer.create(
      {
        tenantId: 'tenant-01',
        name: 'John Doe',
        email: 'johndoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID('customer-1'),
    );

    const request: CreateTicketFromEmailRequest = {
      tenantId: 'tenant-01',
      fromEmail: 'johndoe@example.com',
      subject: 'example subject',
      customer,
      bodyPlain: 'body plain example',
      bodyRaw: '<p>body plain example</p>',
      headers: {},
    };

    const result = await sut.execute(request);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { ticket } = result.value;

      expect(ticket.reporterEmail).toBe('johndoe@example.com');
      expect(ticket.messageCount).toBe(1);
      expect(ticket.customer).toBe(customer);
      expect(ticket.messages).toHaveLength(1);
      expect(ticket.messages[0].bodyPlain).toBe('body plain example');
      expect(ticket.status.value).toBe('open');
      expect(ticket.replyAddress.value).toContain(ticket.id.toString());

      expect(ticketRepository.items).toHaveLength(1);
      expect(ticketRepository.items[0]).toBe(ticket);
    }
  });

  it('should not be able to create a ticket with an invalid email', async () => {
    const customer = Customer.create(
      {
        tenantId: 'tenant-01',
        name: 'John Doe',
        email: 'invalid-email@@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID('customer-1'),
    );

    const request: CreateTicketFromEmailRequest = {
      tenantId: 'tenant-01',
      fromEmail: 'invalid-email@@email.com',
      subject: 'example subject',
      customer,
      bodyPlain: 'body plain example',
      bodyRaw: '<body><div><p>body plain example</p></div></body>',
      headers: {},
    };

    const result = await sut.execute(request);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
    expect(ticketRepository.items).toHaveLength(0);
  });

  it('should not be able to create a ticket with an empty body', async () => {
    const customer = Customer.create(
      {
        tenantId: 'tenant-01',
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID('customer-1'),
    );
    const request: CreateTicketFromEmailRequest = {
      tenantId: 'tenant-01',
      fromEmail: 'joendoe@email.com',
      subject: 'example subject',
      customer,
      bodyPlain: '',
      bodyRaw: '<body><div><p></p></div></body>',
      headers: {},
    };

    const response = await sut.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(EmailBodyEmptyError);
  });
});
