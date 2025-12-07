import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { Customer } from '../../domain/entities/customer';
import { InMemoryCustomersRepository } from '../../test/repositories/in-memory-customers.repository';
import { FindCustomerByEmailUseCase } from './find-customer-by-email.usecase';
import { CustomerNotFoundError } from '@/core/errors/customer-not-found.error';

let customersRepository: InMemoryCustomersRepository;
let sut: FindCustomerByEmailUseCase;

describe('Find Customer By Email', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new FindCustomerByEmailUseCase(customersRepository);
  });

  it('should be able to find an customer by email', async () => {
    const customer = Customer.create({
      email: 'customer@email.com',
      name: 'customer-01',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await customersRepository.save(customer);

    const response = await sut.execute({
      email: 'customer@email.com',
      tenantId: 'tenant-01',
    });

    expect(response.isRight()).toBe(true);

    if (response.isRight()) {
      expect(response.value.customer).toBeInstanceOf(Customer);
    }
  });
  it('should not be able to find an customer with an invalid email', async () => {
    const customer = Customer.create({
      email: 'customer@email.com',
      name: 'customer-01',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await customersRepository.save(customer);

    const response = await sut.execute({
      email: 'invalid-email',
      tenantId: 'tenant-01',
    });

    expect(response.isLeft()).toBe(true);

    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });

  it('should not be able to find and customer if not exists', async () => {
    const customer = Customer.create({
      email: 'customer@email.com',
      name: 'customer-01',
      tenantId: 'tenant-01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await customersRepository.save(customer);

    const response = await sut.execute({
      email: 'other-email@email.com',
      tenantId: 'tenant-01',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(CustomerNotFoundError);
  });
});
