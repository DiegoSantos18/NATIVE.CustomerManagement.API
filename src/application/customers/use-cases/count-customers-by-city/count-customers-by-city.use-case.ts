import type { CityCustomerCount } from '../../../../domain/customers/queries/index.js';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';

export class CountCustomersByCityUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(): Promise<CityCustomerCount[]> {
    return this.customerRepository.countByCity();
  }
}
