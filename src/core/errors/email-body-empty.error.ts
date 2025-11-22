export class EmailBodyEmptyError extends Error {
  constructor() {
    super('Email body empty.');
  }
}
