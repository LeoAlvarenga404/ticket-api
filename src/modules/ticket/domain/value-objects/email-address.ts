import { ValueObject } from '@/core/entities/value-object';

export interface EmailAddressProps {
  value: string;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  static create(_value: string): EmailAddress {
    return new EmailAddress({ value: '' });
  }

  get value(): string {
    return '';
  }
}
