import type { IRepository } from '../../common/repositories/index.js';
import type { Customer } from '../entities/index.js';
import type { CustomerCreateData, CustomerUpdateData } from '../types/index.js';
import type { CityCustomerCount, CustomerFilters, CustomerSortField } from '../queries/index.js';

export interface ICustomerRepository extends IRepository<
  Customer,
  number,
  CustomerCreateData,
  CustomerUpdateData,
  CustomerFilters,
  CustomerSortField
> {
  countByCity(): Promise<CityCustomerCount[]>;
  findDistinctCities(): Promise<string[]>;
}
