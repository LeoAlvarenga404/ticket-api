import { Either, left, right } from '@/core/either';
import { InvalidEmailError } from '@/core/errors/invalid-email.error';
import { Customer } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { EmailAddress } from '../value-objects/email-address';
import { CustomerNotFoundError } from '@/core/errors/customer-not-found.error';

export interface FindCustomerByEmailUseCaseRequest {
  tenantId: string;
  email: string;
}

export type FindCustomerByEmailUseCaseResponse = Either<
  InvalidEmailError | CustomerNotFoundError,
  {
    customer: Customer;
  }
>;

export class FindCustomerByEmailUseCase {
  constructor(private customerRepository: CustomersRepository) {}

  async execute({
    email,
    tenantId,
  }: FindCustomerByEmailUseCaseRequest): Promise<FindCustomerByEmailUseCaseResponse> {
    const emailOrError = EmailAddress.create(email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const customer = await this.customerRepository.findByEmail(
      emailOrError.value.value,
      tenantId,
    );

    if (!customer) {
      return left(new CustomerNotFoundError());
    }

    return right({ customer });
  }
}
