import type { Customer } from '../../../../domain/customers/entities/index.js';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: number): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }
}
