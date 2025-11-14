import { ValueObject } from '@/core/entities/value-object';

export interface EmailReplyAddressProps {
  address: string;
}

export class EmailReplyAddress extends ValueObject<EmailReplyAddressProps> {
  static create(_tenantId: string, _ticketId: string): EmailReplyAddress {
    return new EmailReplyAddress({ address: '' });
  }

  matches(_incoming: string): boolean {
    return false;
  }

  get value() {
    return '';
  }
}
