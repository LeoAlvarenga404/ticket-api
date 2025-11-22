import { right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';

type PriorityProps = 'low' | 'medium' | 'high' | 'urgent' | 'emergency';

interface TicketPriorityProps {
  value: PriorityProps;
}

interface SLAProps {
  response_time: string;
  solution_time: string;
}

export class TicketPriority extends ValueObject<TicketPriorityProps> {
  private static SLA: Record<PriorityProps, SLAProps> = {
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
    emergency: {
      response_time: '10m',
      solution_time: '2h',
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
}
