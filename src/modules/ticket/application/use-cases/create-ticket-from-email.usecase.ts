import { Either, left, right } from '@/core/either';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { EmailAddress } from '../../domain/value-objects/email-address';
import {
  EmailHeaders,
  EmailHeadersProps,
} from '../../domain/value-objects/email-headers';
import { EmailBody } from '../../domain/value-objects/email-body';
import { Ticket } from '../../domain/entities/ticket';
import { TicketStatus } from '../../domain/value-objects/ticket-status';
import { EmailReplyAddress } from '../../domain/value-objects/email-reply-address';
import { Customer } from '../../domain/entities/customer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { TickedClosedError } from '@/core/errors/ticket-closed.error';
import { EmailBodyEmptyError } from '@/core/errors/email-body-empty.error';

export interface CreateTicketFromEmailRequest {
  tenantId: string;
  fromEmail: string;
  subject: string;
  customer: Customer;
  bodyPlain: string;
  bodyRaw?: string;
  headers: EmailHeadersProps;
}

export type CreateTicketFromEmailResponse = Either<
  InvalidEmailError | EmailBodyEmptyError | TickedClosedError,
  {
    ticket: Ticket;
  }
>;

export class CreateTicketFromEmailUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    tenantId,
    fromEmail,
    subject,
    bodyPlain,
    bodyRaw,
    customer,
    headers,
  }: CreateTicketFromEmailRequest): Promise<CreateTicketFromEmailResponse> {
    const validateEmail = EmailAddress.create(fromEmail);

    if (validateEmail.isLeft()) {
      return left(validateEmail.value);
    }

    const ticketId = new UniqueEntityID();
    const replyAddress = EmailReplyAddress.create(
      tenantId,
      ticketId.toString(),
    );

    const ticket = Ticket.create(
      {
        tenantId,
        subject,
        reporterEmail: validateEmail.value.value,
        status: TicketStatus.create('open'),
        replyAddress,
        messageCount: 0,
        customer,

        tagIds: [],
        createdAt: new Date(),
      },
      ticketId,
    );

    const emailBody = EmailBody.create(bodyPlain, bodyRaw);

    if (emailBody.isLeft()) {
      return left(emailBody.value);
    }

    const emailHeaders = headers ? EmailHeaders.create(headers) : undefined;

    const message = ticket.addMessage(
      emailBody.value,
      {
        id: customer.id.toString(),
        type: 'reporter',
      },
      emailHeaders,
    );

    if (message.isLeft()) {
      return left(message.value);
    }

    await this.ticketRepository.save(ticket);

    // TODO: enviar confirmação

    return right({ ticket });
  }
}
