import { right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';

type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

interface TicketPriorityProps {
  value: PriorityLevel;
}

interface SLAProps {
  response_time: string;
  solution_time: string;
}

export class TicketPriority extends ValueObject<TicketPriorityProps> {
  private static SLA: Record<PriorityLevel, SLAProps> = {
    low: {
      response_time: '24h',
      solution_time: '3d',
    },
    medium: {
      response_time: '8h',
      solution_time: '2d',
    },
    high: {
      response_time: '4h',
      solution_time: '1d',
    },
    urgent: {
      response_time: '1h',
      solution_time: '4h',
    },
  };

  get value() {
    return this.props.value;
  }

  changePriority(priority: TicketPriority) {
    return right(new TicketPriority(priority));
  }

  static create({ value }: TicketPriorityProps) {
    return new TicketPriority({ value });
  }

  static default(): TicketPriority {
    return new TicketPriority({ value: 'medium' });
  }
}
