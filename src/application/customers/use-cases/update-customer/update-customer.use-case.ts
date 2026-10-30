import type { Customer } from '../../../../domain/customers/entities/index.js';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import type { CustomerUpdateData } from '../../../../domain/customers/types/index.js';

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: number, data: CustomerUpdateData): Promise<Customer | null> {
    return this.customerRepository.update(id, data);
  }
}
