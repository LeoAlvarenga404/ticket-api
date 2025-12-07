import { Either, left, right } from '@/core/either';
import { Customer, CustomerProps } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerNotFoundError } from '@/core/errors/customer-not-found.error';
import { Optional } from '@/core/types/optional';

export interface DeleteCustomerUseCaseRequest {
  id: string;
  tenantId: string;
}
export type DeleteCustomerUseCaseResponse = Either<CustomerNotFoundError, void>;

export class DeleteCustomerUseCase {
  constructor(private customerRepository: CustomersRepository) {}

  async execute({
    id,
    tenantId,
  }: DeleteCustomerUseCaseRequest): Promise<DeleteCustomerUseCaseResponse> {
    const customer = await this.customerRepository.findById(id, tenantId);

    if (!customer) {
      return left(new CustomerNotFoundError());
    }

    await this.customerRepository.delete(id, tenantId);

    return right(undefined);
  }
}
