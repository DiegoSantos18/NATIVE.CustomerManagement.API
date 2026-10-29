import type { IRepository } from '../../common/repositories/index.js';
import type { Customer } from '../entities/index.js';
import type { CityCustomerCount, CustomerFilters, CustomerSortField } from '../queries/index.js';

export interface ICustomerRepository extends IRepository<
  Customer,
  number,
  CustomerFilters,
  CustomerSortField
> {
  countByCity(): Promise<CityCustomerCount[]>;
  findDistinctCities(): Promise<string[]>;
}
