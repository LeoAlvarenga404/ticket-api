import { Either, left, right } from '@/core/either';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { Customer } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { EmailAddress } from '@/modules/ticket/domain/value-objects/email-address';

export interface FindOrCreateCustomerRequest {
  tenantId: string;
  email: string;
  name?: string;
}

export type FindOrCreateCustomerResponse = Either<
  InvalidEmailError,
  {
    customer: Customer;
  }
>;

export class FindOrCreateCustomerUseCase {
  constructor(private customerRepository: CustomersRepository) {}

  async execute({
    tenantId,
    name,
    email,
  }: FindOrCreateCustomerRequest): Promise<FindOrCreateCustomerResponse> {
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
      return right({ customer, isNew: false });
    }
    customer = Customer.create({
      tenantId,
      name: name?.trim() || email.split('@')[0],
      email: emailOrError.value.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.customerRepository.save(customer);

    return right({ customer });
  }
}
