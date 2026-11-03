import type { Container } from 'inversify';
import type { Server } from 'socket.io';
import type { EventPublisher } from '../../../application/common/ports/index.js';
import { SocketIoEventPublisher } from '../../realtime/index.js';
import { EVENT_PUBLISHER } from '../tokens/index.js';

export function registerRealtimeModule(container: Container, socketServer: Server): void {
  container
    .bind<EventPublisher>(EVENT_PUBLISHER)
    .toConstantValue(new SocketIoEventPublisher(socketServer));
}
