import type { IRepository } from '../../common/repositories/index.js';
import type { Customer } from '../entities/index.js';

export interface ICustomerRepository extends IRepository<Customer> {
  findByCity(city: string): Promise<Customer | null>;
}
