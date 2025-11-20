import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EmailHeaders } from '../value-objects/email-headers';

export interface MessageProps {
  ticketId: string;
  providerMessageId?: string;
  authorType: 'reporter' | 'agent' | 'system';
  authorId?: string;
  bodyRaw?: string;
  bodyPlain: string;
  headers?: EmailHeaders | null;
  direction: 'inbound' | 'outbound';
  createdAt: Date;
}

export class Message extends Entity<MessageProps> {
  get ticketId() {
    return this.props.ticketId;
  }
  get providerMessageId() {
    return this.props.providerMessageId;
  }
  get authorType() {
    return this.props.authorType;
  }
  get authorId() {
    return this.props.authorId;
  }
  get bodyRaw() {
    return this.props.bodyRaw;
  }
  get bodyPlain() {
    return this.props.bodyPlain;
  }
  get headers() {
    return this.props.headers;
  }
  get direction() {
    return this.props.direction;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  linkProviderMessageId(providerId: string) {
    this.props.providerMessageId = providerId
  }

  static create(_props: MessageProps, id?: UniqueEntityID) {
    return new Message({
      ticketId: _props.ticketId,
      authorType: _props.authorType ?? 'reporter',
      authorId: _props.authorId,
      bodyRaw: _props.bodyRaw,
      bodyPlain: _props.bodyPlain,
      headers: (_props.headers ?? null) as EmailHeaders | null,
      direction: _props.direction,
      providerMessageId: _props.providerMessageId,
      createdAt: _props.createdAt ?? new Date(),
     }, id);
  }
}
