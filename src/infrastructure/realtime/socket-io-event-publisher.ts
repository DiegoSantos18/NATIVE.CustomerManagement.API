import type { Server } from 'socket.io';
import type { EventPublisher } from '../../application/common/ports/index.js';

export class SocketIoEventPublisher<
  TEvents extends object = Record<string, unknown>,
> implements EventPublisher<TEvents> {
  constructor(private readonly socketServer: Server) {}

  publish<TEvent extends keyof TEvents & string>(event: TEvent, payload: TEvents[TEvent]): void {
    this.socketServer.emit(event, payload);
  }
}
