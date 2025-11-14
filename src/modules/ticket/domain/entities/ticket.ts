import { TenantEntity } from '@/core/entities/tenant-entity';
import { TicketStatus } from '../value-objects/ticket-status';
import { EmailReplyAddress } from '../value-objects/email-reply-address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

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

export class Ticket extends TenantEntity<TicketProps> {
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

  static create(_props: TicketProps, id?: UniqueEntityID) {
    return new Ticket({ ..._props }, id);
  }
}
