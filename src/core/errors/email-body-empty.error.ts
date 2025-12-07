import { BadRequestError } from "../entities/domain-error";

export class EmailBodyEmptyError extends BadRequestError {
  readonly code = 'EMAIL_BODY_EMPTY'
  constructor() {
    super('Email body empty.');
  }
}
