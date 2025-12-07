import { NotFoundError } from '../entities/domain-error';

export class CustomerNotFoundError extends NotFoundError {
  readonly code = 'CUSTOMER_NOT_FOUND';

  constructor() {
    super('Customer not found.');
  }
}
