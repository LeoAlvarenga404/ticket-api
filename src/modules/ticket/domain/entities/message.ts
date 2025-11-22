import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EmailHeaders } from '../value-objects/email-headers';
import { EmailBody } from '../value-objects/email-body';

interface Attachment {}

export interface MessageProps {
  ticketId: string;
  providerMessageId?: string;
  authorType: 'reporter' | 'agent' | 'system';
  authorId: string;
  emailBody: EmailBody;
  headers?: EmailHeaders | null;
  attachments?: Attachment[];
  editedAt?: Date;
  mentions?: string[]; // agent ids
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
    return this.props.emailBody.bodyRaw;
  }
  get bodyPlain() {
    return this.props.emailBody.bodyPlain;
  }
  get headers() {
    return this.props.headers;
  }
  get direction() {
    return this.props.direction;
  }

  get attachments() {
    return this.props.attachments;
  }
  get mentions() {
    return this.props.mentions;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  linkProviderMessageId(providerId: string) {
    this.props.providerMessageId = providerId;
  }

  static create(_props: MessageProps, id?: UniqueEntityID) {
    return new Message(
      {
        ticketId: _props.ticketId,
        authorType: _props.authorType ?? 'reporter',
        authorId: _props.authorId,
        emailBody: _props.emailBody,
        headers: (_props.headers ?? null) as EmailHeaders | null,
        direction: _props.direction,
        providerMessageId: _props.providerMessageId,
        attachments: _props.attachments ?? [],
        mentions: _props.mentions ?? [],
        createdAt: _props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
