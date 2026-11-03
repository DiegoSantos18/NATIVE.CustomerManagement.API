export const CUSTOMER_UPDATED_EVENT = 'customer:updated';

export interface CustomerUpdatedEvent {
  customerId: number;
}

export interface CustomerEvents {
  'customer:updated': CustomerUpdatedEvent;
}
