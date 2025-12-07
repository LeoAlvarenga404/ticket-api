import { CustomerNotFoundError } from '@/core/errors/customer-not-found.error';
import { Customer } from '../../domain/entities/customer';
import { InMemoryCustomersRepository } from '../../test/repositories/in-memory-customers.repository';
import { ListCustomerByTenantUseCase } from './list-customer-by-tenant.usecase';

let customersRepository: InMemoryCustomersRepository;
let sut: ListCustomerByTenantUseCase;

describe('List Customer By Tenant', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new ListCustomerByTenantUseCase(customersRepository);
  });

  it('should be able to list customers by tenant id', async () => {
    const customer1 = Customer.create({
      email: 'customer1@email.com',
      name: 'customer-01',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const customer2 = Customer.create({
      email: 'customer2@email.com',
      name: 'customer-02',
      tenantId: 'tenant-02',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const customer3 = Customer.create({
      email: 'customer3@email.com',
      name: 'customer-03',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await customersRepository.save(customer1);
    await customersRepository.save(customer2);
    await customersRepository.save(customer3);

    const response = await sut.execute({
      tenantId: 'tenant-01',
    });

    expect(response.isRight()).toBe(true);

    if (response.isRight()) {
      expect(response.value.customers).toHaveLength(2);
    }
  });
});
