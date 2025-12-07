import { BadRequestError } from '../entities/domain-error';

export class TenantMismatchError extends BadRequestError {
  readonly code = 'TENANT_MISMATCH';
  constructor() {
    super('Tenant mismatch.');
  }
}
