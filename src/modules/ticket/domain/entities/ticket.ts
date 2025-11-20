import { TenantEntity } from '@/core/entities/tenant-entity';
import { TicketStatus } from '../value-objects/ticket-status';
import { EmailReplyAddress } from '../value-objects/email-reply-address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Message } from './message';
import { Either, left, right } from '@/core/either';
import { TickedClosedError } from '@/core/errors/ticket-closed.error';
import { InvalidTransitionError } from '@/core/errors/invalid-transition.error';
import { DomainEvent } from '@/core/events/domain-event';
import { TicketCreatedEvent } from '../events/ticket-created.event';

export interface TicketProps {
  tenantId: string;
  subject: string;
  reporterEmail: string;
  status: TicketStatus;
  replyAddress: EmailReplyAddress;
  messageCount: number;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MessageAuthor {
  id?: string;
  type: 'reporter' | 'agent' | 'system';
}

export class Ticket extends TenantEntity<TicketProps> {
  private _messages: Message[] = [];
  private _domainEvents: DomainEvent[] = [];

  get messages(): readonly Message[] {
    return this._messages;
  }

  get subject() {
    return this.props.subject;
  }
  get reporterEmail() {
    return this.props.reporterEmail;
  }
  get status() {
    return this.props.status;
  }
  get replyAddress() {
    return this.props.replyAddress;
  }
  set replyAddress(address: EmailReplyAddress) {
    this.props.replyAddress = address;
  }
  get messageCount() {
    return this.props.messageCount;
  }

  get lastMessageAt() {
    return this.props.lastMessageAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  clearEvents() {
    this._domainEvents = [];
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  addMessage(
    content: string,
    author: MessageAuthor,
  ): Either<TickedClosedError, Message> {
    if (this.status.isClosed()) {
      return left(new TickedClosedError());
    }
    const message = Message.create({
      ticketId: this.id.toString(),
      authorType: author.type,
      authorId: author.id,
      bodyPlain: content,
      direction: author.type === 'reporter' ? 'inbound' : 'outbound',
      createdAt: new Date(),
    });

    this._messages.push(message);
    this.props.messageCount++;
    this.props.lastMessageAt = new Date();
    this.touch();

    return right(message);
  }

  close(): Either<InvalidTransitionError, void> {
    const result = this.status.transitionTo('closed');

    if (result.isLeft()) {
      return left(result.value);
    }

    this.props.status = result.value;
    this.touch();
    return right(undefined);
  }

  reopen(): Either<InvalidTransitionError, void> {
    if (!this.status.isClosed()) {
      return right(undefined);
    }

    this.props.status = TicketStatus.create('open');
    this.touch();
    return right(undefined);
  }

  static create(_props: TicketProps, id?: UniqueEntityID) {
    const ticket = new Ticket({ ..._props }, id);
    ticket._domainEvents.push(new TicketCreatedEvent(ticket));
    return ticket;
  }
}
