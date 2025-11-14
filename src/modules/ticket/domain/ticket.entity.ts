import { TenantEntity } from '@/core/entities/tenant-entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';
import { TicketStatus } from './value-objects/ticket-status';

export interface TicketProps {
  tenantId: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Ticket extends TenantEntity<TicketProps> {
  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<TicketProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const ticket = new Ticket(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? TicketStatus.create('open'),
      },
      id,
    );

    return ticket;
  }
}
