import type { Container } from 'inversify';
import {
  CountCustomersByCityUseCase,
  GetCustomerByIdUseCase,
  GetCustomerCitiesUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
} from '../../../application/customers/use-cases/index.js';
import type { EventPublisher } from '../../../application/common/ports/index.js';
import type { CustomerEvents } from '../../../application/customers/events/index.js';
import { CustomersController } from '../../../presentation/controllers/customers/index.js';
import { EVENT_PUBLISHER } from '../tokens/index.js';
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
    .bind(GetCustomerCitiesUseCase)
    .toDynamicValue(
      (context) => new GetCustomerCitiesUseCase(context.get(PrismaCustomerRepository)),
    );

  container
    .bind(ListCustomersUseCase)
    .toDynamicValue((context) => new ListCustomersUseCase(context.get(PrismaCustomerRepository)));

  container
    .bind(GetCustomerByIdUseCase)
    .toDynamicValue((context) => new GetCustomerByIdUseCase(context.get(PrismaCustomerRepository)));

  container
    .bind(UpdateCustomerUseCase)
    .toDynamicValue(
      (context) =>
        new UpdateCustomerUseCase(
          context.get(PrismaCustomerRepository),
          context.get<EventPublisher<CustomerEvents>>(EVENT_PUBLISHER),
        ),
    );

  // Controllers
  container
    .bind(CustomersController)
    .toDynamicValue(
      (context) =>
        new CustomersController(
          context.get(CountCustomersByCityUseCase),
          context.get(GetCustomerCitiesUseCase),
          context.get(ListCustomersUseCase),
          context.get(GetCustomerByIdUseCase),
          context.get(UpdateCustomerUseCase),
        ),
    );
}
