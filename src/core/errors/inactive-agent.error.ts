export class InactiveAgentError extends Error {
  constructor() {
    super('Agent inactive.');
  }
}
