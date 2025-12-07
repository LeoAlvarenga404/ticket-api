import { Customer } from '../../domain/entities/customer';
import { InMemoryCustomersRepository } from '../../test/repositories/in-memory-customers.repository';
import { DeleteCustomerUseCase } from './delete-customer.usecase';
import { UpdateCustomerUseCase } from './update-customer.usecase';

let customersRepository: InMemoryCustomersRepository;
let sut: DeleteCustomerUseCase;

describe('Delete Customer', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new DeleteCustomerUseCase(customersRepository);
  });

  it('should be able to delete an customer', async () => {
    const customer = Customer.create({
      email: 'customer1@email.com',
      name: 'customer-01',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const customer2 = Customer.create({
      email: 'customer2@email.com',
      name: 'customer-02',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const customer3 = Customer.create({
      email: 'customer1@email.com',
      name: 'customer-03',
      tenantId: 'tenant-02',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await customersRepository.save(customer);
    await customersRepository.save(customer2);
    await customersRepository.save(customer3);


    const response = await sut.execute({
      tenantId: 'tenant-01',
      id: customer.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(customersRepository.items).toHaveLength(2);
  });
});
