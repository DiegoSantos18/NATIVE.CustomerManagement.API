import type { Customer } from '../../../../domain/customers/entities/index.js';
import type { ICustomerRepository } from '../../../../domain/customers/repositories/index.js';
import type { CustomerUpdateData } from '../../../../domain/customers/types/index.js';
import type { EventPublisher } from '../../../common/ports/index.js';
import { CUSTOMER_UPDATED_EVENT } from '../../events/index.js';
import type { CustomerEvents } from '../../events/index.js';

export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly eventPublisher: EventPublisher<CustomerEvents>,
  ) {}

  async execute(id: number, data: CustomerUpdateData): Promise<Customer | null> {
    const customer = await this.customerRepository.update(id, data);

    if (customer) {
      this.eventPublisher.publish(CUSTOMER_UPDATED_EVENT, { customerId: id });
    }

    return customer;
  }
}
