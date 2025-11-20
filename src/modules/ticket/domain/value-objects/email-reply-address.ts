import { ValueObject } from '@/core/entities/value-object';

export interface EmailReplyAddressProps {
  address: string;
}

export class EmailReplyAddress extends ValueObject<EmailReplyAddressProps> {
  private static DOMAIN = 'leonardo@acme.com';

  static create(tenantId: string, ticketId: string): EmailReplyAddress {
    const address = `ticket+${tenantId}+${ticketId}@${this.DOMAIN}`;

    return new EmailReplyAddress({ address: address.toLowerCase() });
  }

  matches(incoming: string): boolean {
    return this.props.address === incoming.toLowerCase();
  }

  get value() {
    return this.props.address;
  }

  static parseTicketId(address: string): string | null {
    const match = address.match(/ticket\+[\w-]+\+([\w-]+)@/);
    return match ? match[1] : null;
  }

  static parseTenantId(address: string): string | null {
    const match = address.match(/ticket\+([\w-]+)\+[\w-]+@/);
    return match ? match[1] : null;
  }
}
