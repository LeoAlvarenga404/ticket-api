import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketProps {
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Ticket extends Entity<TicketProps> {
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

  set title(title: string) {
    this.props.title = title;

    this.touch();
  }
  set description(description: string) {
    this.props.description = description;

    this.touch();
  }

  set status(status: TicketStatus) {
    this.props.status = status;

    this.touch();
  }

  static create(
    props: Optional<TicketProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const ticket = new Ticket(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'open',
      },
      id,
    );

    return ticket;
  }
}
