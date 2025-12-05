export class WeakPasswordError extends Error {
  constructor(value: string) {
    super(value ?? 'Weak password.');
  }
}
