import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';
import { InvalidTransitionError } from '@/core/errors/invalid-transition.error';

export type StatusProps =
  | 'open'
  | 'in_progress'
  | 'on_hold'
  | 'awaiting_customer'
  | 'resolved'
  | 'closed';

interface TicketStatusProps {
  value: StatusProps;
}

export class TicketStatus extends ValueObject<TicketStatusProps> {
  private static TRANSITIONS: Record<StatusProps, StatusProps[]> = {
    open: ['in_progress', 'closed', 'awaiting_customer'],
    in_progress: ['resolved', 'open', 'closed', 'on_hold', 'awaiting_customer'],
    awaiting_customer: ['in_progress', 'closed', 'resolved', 'on_hold'],
    on_hold: ['resolved', 'in_progress', 'closed', 'awaiting_customer'],
    resolved: ['closed', 'open'],
    closed: [],
  };

  get value(): StatusProps {
    return this.props.value;
  }

  static create(value: StatusProps) {
    return new TicketStatus({ value });
  }

  canTransitionTo(target: StatusProps): boolean {
    return TicketStatus.TRANSITIONS[this.value].includes(target);
  }

  transitionTo(
    target: StatusProps,
  ): Either<InvalidTransitionError, TicketStatus> {
    if (!this.canTransitionTo(target)) {
      return left(new InvalidTransitionError());
    }
    return right(TicketStatus.create(target));
  }

  isClosed() {
    return this.value === 'closed';
  }

  isActive() {
    return ['open', 'in_progress', 'on_hold'].includes(this.value);
  }
}
