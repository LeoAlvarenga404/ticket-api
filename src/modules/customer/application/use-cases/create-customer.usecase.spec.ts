import { InMemoryCustomersRepository } from '../../test/repositories/in-memory-customers.repository';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { FindCustomerByEmailUseCase } from './find-customer-by-email.usecase';
import { CreateCustomerUseCase } from './create-customer.usecase';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let customersRepository: InMemoryCustomersRepository;
let sut: CreateCustomerUseCase;

describe('Create Customer', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new CreateCustomerUseCase(customersRepository);
  });

  it('should be able to create an customer', async () => {
    const response = await sut.execute({
      email: 'customer@email.com',
      tenantId: 'tenant-01',
    });

    expect(response.isRight()).toBe(true);
    expect(customersRepository.items.length).toEqual(1);
  });

  it('should not be able to create a customer with an invalid email', async () => {
    const response = await sut.execute({
      email: 'invalid-email',
      tenantId: 'tenant-01',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });
});
