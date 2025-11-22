export class UnauthorizedError extends Error {
  constructor(value?: string) {
    super(value ?? 'This ticket is closed');
  }
}
