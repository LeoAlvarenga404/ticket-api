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
    return '';
  }
  get inReplyTo() {
    return '';
  }
  get references() {
    return [];
  }
  get from() {
    return '';
  }
  get to() {
    return [];
  }
  get subject() {
    return '';
  }
  get date() {
    return '';
  }

  static create(_props: EmailHeadersProps): EmailHeaders {
    return new EmailHeaders({});
  }
}
