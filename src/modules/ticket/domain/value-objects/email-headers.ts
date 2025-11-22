import { ValueObject } from '@/core/entities/value-object';

export interface EmailHeadersProps {
  messageId?: string;
  inReplyTo?: string;
  references?: string[];
  date?: Date;
}

export class EmailHeaders extends ValueObject<EmailHeadersProps> {
  get messageId() {
    return this.props.messageId;
  }
  get inReplyTo() {
    return this.props.inReplyTo;
  }
  get references() {
    return this.props.references ?? [];
  }
  get date() {
    return this.props.date;
  }

  static create(props: EmailHeadersProps): EmailHeaders {
    return new EmailHeaders(props);
  }
}
