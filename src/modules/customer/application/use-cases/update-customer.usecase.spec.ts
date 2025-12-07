import { Customer } from '../../domain/entities/customer';
import { InMemoryCustomersRepository } from '../../test/repositories/in-memory-customers.repository';
import { UpdateCustomerUseCase } from './update-customer.usecase';

let customersRepository: InMemoryCustomersRepository;
let sut: UpdateCustomerUseCase;

describe('Update Customer', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new UpdateCustomerUseCase(customersRepository);
  });

  it('should be able to update an customer', async () => {
    const customer = Customer.create({
      email: 'customer1@email.com',
      name: 'customer-01',
      tenantId: 'tenant-01',
      createdAt: new Date(2024, 0, 18),
      updatedAt: new Date(2024, 0, 18),
    });

    await customersRepository.save(customer);

    const response = await sut.execute({
      tenantId: 'tenant-01',
      id: customer.id.toString(),
      name: 'change-name-customer-01',
    });

    expect(response.isRight()).toBe(true);
    if (response.isRight()) {
      expect(response.value.customer).toEqual(
        expect.objectContaining({
          name: 'change-name-customer-01',
        }),
      );
    }
  });
});
