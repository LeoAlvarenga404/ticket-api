import { ValueObject } from '@/core/entities/value-object';

export type RawStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

interface TicketStatusProps {
  value: RawStatus;
}

export class TicketStatus extends ValueObject<TicketStatusProps> {
  get value(): RawStatus {
    return this.props.value;
  }

  static create(value: RawStatus) {
    return new TicketStatus({ value });
  }

  transitionTo(_value: RawStatus): TicketStatus {
    return TicketStatus.create(_value);
  }

  canTransitionTo(_value: string): boolean {
    return false;
  }

  isClosed() {
    return this.value === 'closed';
  }

  isActive() {
    return ['open', 'in_progress'].includes(this.value);
  }
}
