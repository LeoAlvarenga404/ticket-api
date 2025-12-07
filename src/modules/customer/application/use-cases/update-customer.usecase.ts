import { Either, left, right } from '@/core/either';
import { Customer, CustomerProps } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerNotFoundError } from '@/core/errors/customer-not-found.error';
import { Optional } from '@/core/types/optional';

export interface UpdateCustomerUseCaseRequest {
  id: string;
  tenantId: string;
  name?: string;
  email?: string;
}
export type UpdateCustomerUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    customer: Customer;
  }
>;

export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomersRepository) {}

  async execute({
    id,
    tenantId,
    name,
    email,
  }: UpdateCustomerUseCaseRequest): Promise<UpdateCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findById(id, tenantId);

    if (!customer) {
      return left(new CustomerNotFoundError());
    }

    if (name !== undefined) customer.changeName(name);
    if (email !== undefined) customer.changeEmail(email);

    await this.customerRepository.save(customer);

    return right({ customer });
  }
}
