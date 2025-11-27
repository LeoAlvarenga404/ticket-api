export class WeakPasswordError extends Error {
  constructor() {
    super('Weak password.');
  }
}
