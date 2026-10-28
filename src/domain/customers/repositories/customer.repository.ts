import type { IRepository } from '../../common/repositories/index.js';
import type { Customer } from '../entities/index.js';
import type { CityCustomerCount, CustomerFilters } from '../queries/index.js';

export interface ICustomerRepository extends IRepository<Customer, number, CustomerFilters> {
  countByCity(): Promise<CityCustomerCount[]>;
  findDistinctCities(): Promise<string[]>;
}
