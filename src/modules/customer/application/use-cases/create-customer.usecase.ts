import { Either, left, right } from '@/core/either';
import { Customer } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { EmailAddress } from '../value-objects/email-address';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { CustomerAlreadyExistsError } from '@/core/errors/customer-already-exists.error';

export interface CreateCustomerRequest {
  tenantId: string;
  name?: string;
  email: string;
}

export type CreateCustomerResponse = Either<
  InvalidEmailError | CustomerAlreadyExistsError,
  {
    customer: Customer;
  }
>;

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomersRepository) {}

  async execute({
    tenantId,
    name,
    email,
  }: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const emailOrError = EmailAddress.create(email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    let customer;

    customer = await this.customerRepository.findByEmail(
      emailOrError.value.value,
      tenantId,
    );

    if (customer) {
      return left(new CustomerAlreadyExistsError());
    }

    customer = Customer.create({
      tenantId,
      name: name?.trim() ?? 'New Customer',
      email: emailOrError.value.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.customerRepository.save(customer);

    return right({ customer });
  }
}
