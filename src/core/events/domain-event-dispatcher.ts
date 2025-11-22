import { DomainEvent } from './domain-event';

export class DomainEventDispatcher {
  private handlers: Map<string, Function[]> = new Map();

  register(eventName: string, handler: Function) {}
  dispatch(event: DomainEvent): void {}
}
