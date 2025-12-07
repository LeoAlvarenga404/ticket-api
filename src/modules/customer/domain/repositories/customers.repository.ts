import { Customer } from '../entities/customer';

export abstract class CustomersRepository {
  abstract save(customer: Customer): Promise<void>;
  abstract findById(
    customerId: string,
    tenantId: string,
  ): Promise<Customer | null>;
  abstract findByEmail(
    email: string,
    tenantId: string,
  ): Promise<Customer | null>;
  abstract listByTenant(tenantId: string): Promise<Customer[]>;
  abstract delete(customerId: string, tenandId: string): Promise<void>;
}
