import { Customer } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = [];

  async findById(id: string) {
    return this.items.find((t) => t.id.toString() === id) || null;
  }

  async findByEmail(email: string, tenantId: string) {
    return (
      this.items.find((t) => t.email === email && t.tenantId === tenantId) ||
      null
    );
  }
  async listByTenant(tenantId: string): Promise<Customer[]> {
    return this.items.filter((customer) => customer.tenantId === tenantId);
  }

  async save(user: Customer) {
    const index = this.items.findIndex(
      (t) => t.id.toString() === user.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = user;
    } else {
      this.items.push(user);
    }
  }

  async delete(customerId: string, tenandId: string): Promise<void> {
    const index = this.items.findIndex(
      (t) =>
        t.id.toString() === customerId.toString() && t.tenantId === tenandId,
    );
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
