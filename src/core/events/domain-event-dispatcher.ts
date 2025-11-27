import { Entity } from '../entities/entity';
import { DomainEvent } from './domain-event';

export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export class DomainEventDispatcher {
  private handlers: Map<string, DomainEventHandler<any>[]> = new Map();

  // registra um handler para um tipo de evento
  register<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>,
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  // dispara um evento para todos os handler registrados
  async dispatch(event: DomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    await Promise.all(
      handlers.map((handler) =>
        handler.handle(event).catch((error) => {
          console.error(`Error handling ${eventName}: `, error);
        }),
      ),
    );
  }

  // dispara todos os eventos de um agregado
  async dispatchEventsForAggregate(aggregate: Entity<any>): Promise<void> {
    const events = (aggregate as any).domainEvents || [];

    for (const event of events) {
      await this.dispatch(event);
    }

    if (typeof (aggregate as any).clearEvents === 'function') {
      (aggregate as any).clearEvents();
    }
  }
}
