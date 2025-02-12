import { ErrorCode } from '@config/errors';
import { SocketService } from '@common/socket/socket.service';
import { Socket } from 'socket.io';
import { Router } from '@common/socket/router';
import logger from '@common/logger';
import { IAuthUser, UserType } from '@common/constant';

export class AuthMiddleware {
    static authenticate(socket: Socket, next: () => void): void {
        const {
            query: { token: tmp = '' },
        } = socket.handshake;
        let token = '';
        if (Array.isArray(tmp)) {
            token = tmp[0];
        } else {
            token = tmp as string;
        }

        if (token) {
        }
        AuthMiddleware.getAuthFromToken(token).then(async (authUser) => {
            if (authUser) {
                logger.debug(`Socket ${socket.id} authenticated: `, authUser);
                // Emit authenticated event
                socket.emit('authenticated');
                Router.registerPrivate(socket);
                await SocketService.register(socket, authUser);
            } else {
                logger.debug(`Failed to authenticated socket ${socket.id}: `, token);
                socket.emit('unauthorized', {
                    error_code: ErrorCode.REQUEST_UNAUTHORIZED,
                    message: 'Unauthorized',
                });
            }
            next();
        });
    }

    static async getAuthFromToken(token: string): Promise<IAuthUser> {
        if (token) {
            return {
                id: 1,
                type: UserType.USER,
            };
        }
        return null;
    }
}
