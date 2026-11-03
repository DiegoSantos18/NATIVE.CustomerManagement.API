export interface EventPublisher<TEvents extends object = Record<string, unknown>> {
  publish<TEvent extends keyof TEvents & string>(event: TEvent, payload: TEvents[TEvent]): void;
}
