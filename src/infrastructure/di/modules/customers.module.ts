import type { Container } from 'inversify';

import { CountCustomersByCityUseCase } from '../../../application/customers/use-cases/index.js';
import { CustomersController } from '../../../presentation/controllers/customers/index.js';
import { PrismaCustomerRepository } from '../../repositories/index.js';

export function registerCustomersModule(container: Container): void {
  // Repositories
  container.bind(PrismaCustomerRepository).toSelf().inSingletonScope();

  // Use Cases
  container
    .bind(CountCustomersByCityUseCase)
    .toDynamicValue(
      (context) => new CountCustomersByCityUseCase(context.get(PrismaCustomerRepository)),
    );

  // Controllers
  container
    .bind(CustomersController)
    .toDynamicValue((context) => new CustomersController(context.get(CountCustomersByCityUseCase)));
}
