import { TenantEntity } from '@/core/entities/tenant-entity';
import { TicketStatus } from '../value-objects/ticket-status';
import { EmailReplyAddress } from '../value-objects/email-reply-address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Message } from './message';
import { EmailBody } from '../value-objects/email-body';
import { EmailHeaders } from '../value-objects/email-headers';
import { Either, left, right } from '@/core/either';
import { TickedClosedError } from '@/core/errors/ticket-closed.error';
import { InvalidTransitionError } from '@/core/errors/invalid-transition.error';
import { DomainEvent } from '@/core/events/domain-event';
import { TicketCreatedEvent } from '../events/ticket-created.event';
import { Customer } from '@/modules/customer/domain/entities/customer';
import { Agent } from '@/modules/user/domain/entities/agent';
import { TenantMismatchError } from '@/core/errors/tenant-mismatch.error';
import { InactiveAgentError } from '@/core/errors/inactive-agent.error';
import { TicketAssignedEvent } from '../events/ticket-assigned.event';
import { MessageAddedEvent } from '../events/message-added.event';

export interface TicketProps {
  tenantId: string;
  subject: string;
  customer: Customer;
  reporterEmail: string;
  status: TicketStatus;
  replyAddress: EmailReplyAddress;
  tagIds: string[];
  messageCount: number;
  assigneeId?: string;
  assignedAt?: Date;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MessageAuthor {
  id: string;
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

  get assigneeId() {
    return this.props.assigneeId;
  }

  get assignedAt() {
    return this.props.assignedAt;
  }

  get customer() {
    return this.props.customer;
  }

  get isAssigned(): boolean {
    return !!this.props.assigneeId;
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

  private touch() {
    this.props.updatedAt = new Date();
  }
  clearEvents() {
    this._domainEvents = [];
  }
  assignTo(
    agent: Agent,
  ): Either<TenantMismatchError | InactiveAgentError, void> {
    if (agent.tenantId !== this.tenantId) {
      return left(new TenantMismatchError());
    }

    if (!agent.isActive) {
      return left(new InactiveAgentError());
    }

    const previousAssignee = this.props.assigneeId;

    this.props.assigneeId = agent.id.toString();
    this.props.assignedAt = new Date();
    this.touch();

    this._domainEvents.push(
      new TicketAssignedEvent(this, agent, previousAssignee),
    );

    return right(undefined);
  }

  addMessage(
    content: EmailBody,
    author: MessageAuthor,
    headers?: EmailHeaders,
  ): Either<TickedClosedError, Message> {
    if (this.status.isClosed()) {
      return left(new TickedClosedError());
    }
    const message = Message.create({
      ticketId: this.id.toString(),
      authorType: author.type,
      authorId: author.id,
      emailBody: content,
      headers,
      direction: author.type === 'reporter' ? 'inbound' : 'outbound',
      createdAt: new Date(),
    });

    this._messages.push(message);
    this.props.messageCount++;

    this.props.lastMessageAt = new Date();
    this.touch();

    this._domainEvents.push(new MessageAddedEvent(this, message));

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
