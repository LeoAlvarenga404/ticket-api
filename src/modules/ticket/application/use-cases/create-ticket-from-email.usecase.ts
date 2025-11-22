import { left, right } from '@/core/either';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { EmailAddress } from '../../domain/value-objects/email-address';
import { EmailHeadersProps } from '../../domain/value-objects/email-headers';
import { Ticket } from '../../domain/entities/ticket';
import { TicketStatus } from '../../domain/value-objects/ticket-status';
import { EmailReplyAddress } from '../../domain/value-objects/email-reply-address';

interface CreateTicketFromEmailRequest {
  tenantId: string;
  fromEmail: string;
  subject: string;
  bodyPlain: string;
  bodyRaw?: string;
  headers: EmailHeadersProps;
}

export class CreateTicketFromEmailUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    tenantId,
    fromEmail,
    subject,
    bodyPlain,
    bodyRaw,
    headers,
  }: CreateTicketFromEmailRequest) {
    const validateEmail = EmailAddress.create(fromEmail);

    if (validateEmail.isLeft()) {
      return left(validateEmail.value);
    }

    const ticket = Ticket.create({
      tenantId,
      subject,
      reporterEmail: validateEmail.value.value,
      status: TicketStatus.create('open'),
      replyAddress: EmailReplyAddress.create(tenantId, ''),
      messageCount: 0,
      createdAt: new Date(),
    });

    ticket.replyAddress = EmailReplyAddress.create(
      tenantId,
      ticket.id.toString(),
    );

    const message = ticket.addMessage(bodyPlain, {
      id: '',
      type: 'reporter',
    });

    if (message.isLeft()) {
      return left(message.value);
    }

    await this.ticketRepository.save(ticket);

    // TODO: enviar confirmação

    return right({ ticket });
  }
}
