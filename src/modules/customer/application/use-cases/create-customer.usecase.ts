import { Either, left, right } from '@/core/either';
import { Customer } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { EmailAddress } from '@/modules/ticket/domain/value-objects/email-address';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { CustomerAlreadyExistsError } from '@/core/errors/customer-already-exists.error';

export interface CreateCustomerRequest {
  tenantId: string;
  name: string;
  email: string;
}

export type CreateCustomerResponse = Either<
  InvalidEmailError,
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
      name: name?.trim(),
      email: emailOrError.value.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.customerRepository.save(customer);

    return right({ customer });
  }
}
