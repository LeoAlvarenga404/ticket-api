import { Either, left, right } from '@/core/either';
import { Customer } from '../../domain/entities/customer';
import { CustomersRepository } from '../../domain/repositories/customers.repository';
import { CustomerNotFoundError } from '@/core/errors/customer-not-found.error';

export interface ListCustomersByTenantUseCaseRequest {
  tenantId: string;
}

export type ListCustomersByTenantUseCaseResponse = Either<
  CustomerNotFoundError,
  {
    customers: Customer[];
  }
>;

export class ListCustomerByTenantUseCase {
  constructor(private customerRepository: CustomersRepository) {}

  async execute({
    tenantId,
  }: ListCustomersByTenantUseCaseRequest): Promise<ListCustomersByTenantUseCaseResponse> {
    const customers = await this.customerRepository.listByTenant(tenantId);

    if (customers.length <= 0) {
      left(new CustomerNotFoundError());
    }

    return right({ customers });
  }
}
