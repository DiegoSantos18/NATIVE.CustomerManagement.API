import type { Customer } from '../../../../domain/customers/entities/index.js';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import type {
  CustomerFilters,
  CustomerSortField,
} from '../../../../domain/customers/queries/index.js';
import type { PaginatedResult, QueryParams } from '../../../../domain/common/queries/index.js';

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(
    params: QueryParams<CustomerFilters, CustomerSortField>,
  ): Promise<PaginatedResult<Customer>> {
    return this.customerRepository.findAll(params);
  }
}
