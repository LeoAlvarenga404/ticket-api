export class TickedClosedError extends Error {
  constructor() {
    super('This ticket is closed');
  }
}
;
