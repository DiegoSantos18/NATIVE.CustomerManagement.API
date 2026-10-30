import type { Container } from 'inversify';

import {
  CountCustomersByCityUseCase,
  GetCustomerByIdUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
} from '../../../application/customers/use-cases/index.js';
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
  container
    .bind(ListCustomersUseCase)
    .toDynamicValue((context) => new ListCustomersUseCase(context.get(PrismaCustomerRepository)));
  container
    .bind(GetCustomerByIdUseCase)
    .toDynamicValue((context) => new GetCustomerByIdUseCase(context.get(PrismaCustomerRepository)));
  container
    .bind(UpdateCustomerUseCase)
    .toDynamicValue((context) => new UpdateCustomerUseCase(context.get(PrismaCustomerRepository)));

  // Controllers
  container
    .bind(CustomersController)
    .toDynamicValue(
      (context) =>
        new CustomersController(
          context.get(CountCustomersByCityUseCase),
          context.get(ListCustomersUseCase),
          context.get(GetCustomerByIdUseCase),
          context.get(UpdateCustomerUseCase),
        ),
    );
}
