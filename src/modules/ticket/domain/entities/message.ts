import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface MessageProps {
  ticketId: string;
  authorType: 'reporter' | 'agent' | 'system';
  authorId?: string;
  bodyRaw?: string;
  bodyPlain: string;
  headers?: null;
  direction: 'inbound' | 'outbound';
  createdAt: Date;
}

export class Message extends Entity<MessageProps> {
  get ticketId() {
    return this.props.ticketId;
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

  static create(_props: MessageProps, id?: UniqueEntityID) {
    return new Message({ ..._props }, id);
  }
}
