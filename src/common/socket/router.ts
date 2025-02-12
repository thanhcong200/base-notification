import logger from '@common/logger';
import { Socket } from 'socket.io';

export class Router {
    /**
     * Register public event
     * @param socket Socket
     */
    static register(socket: Socket): void {
        // Register public event here
        socket.on('ping', () => {
            logger.debug('Receive ping');
            socket.send('pong');
        });
    }
    /**
     * Register private event
     * @param socket Socket
     */
    static registerPrivate(socket: Socket): void {
        // Register private event here
        socket.on('private', () => {
            logger.debug('Receive private');
            socket.send('pong');
        });
    }
}
