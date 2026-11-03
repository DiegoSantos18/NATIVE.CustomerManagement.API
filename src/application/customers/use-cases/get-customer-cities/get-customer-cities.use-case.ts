import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';

export class GetCustomerCitiesUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(): Promise<string[]> {
    return this.customerRepository.findDistinctCities();
  }
}
