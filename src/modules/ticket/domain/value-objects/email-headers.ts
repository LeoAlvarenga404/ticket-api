import { ValueObject } from '@/core/entities/value-object';

export interface EmailHeadersProps {
  messageId?: string;
  inReplyTo?: string;
  references?: string[];
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
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
  get from() {
    return this.props.from;
  }
  get to() {
    return this.props.to;
  }
  get subject() {
    return this.props.subject;
  }
  get date() {
    return this.props.date;
  }

  static create(props: EmailHeadersProps): EmailHeaders {
    return new EmailHeaders(props);
  }
}
