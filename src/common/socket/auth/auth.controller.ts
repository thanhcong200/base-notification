import logger from '@common/logger';
import { Socket } from 'socket.io';
import { AuthMiddleware } from './auth.middleware';

export class AuthController {
    static async handleDisconnect(socket: Socket): Promise<void> {
        const {
            query: { token: tmp = '' },
        } = socket.handshake;
        let token = '';
        if (Array.isArray(tmp)) {
            token = tmp[0];
        } else {
            token = tmp as string;
        }
        const user = await AuthMiddleware.getAuthFromToken(token);
        if (!user) {
            logger.debug(`Can't get user from socket ${socket.id}`);
            return;
        }
    }
}
