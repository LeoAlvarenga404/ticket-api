import { ConflictError } from '../entities/domain-error';

export class CustomerAlreadyExistsError extends ConflictError {
  readonly code = 'CUSTOMER_ALREADY_EXISTS';
  
  constructor() {
    super('Customer already exist.');
  }
}
