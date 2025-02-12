import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '@common/logger';
import { NODE_ENV } from '@config/environment';
import {Router} from '@common/socket/router'
import { AuthController } from '@common/socket/auth/auth.controller';
import { AuthMiddleware } from '@common/socket/auth/auth.middleware';
import { SocketService } from '@common/socket/socket.service';

/**
 * Abstraction around the raw Socket.io server and Nodes' HTTP server.
 */
export class SocketServer {
    private server?: Server;
    
    public async setup(httpServer: HttpServer): Promise<Server> {
        SocketService.setup(httpServer);
        this.server = new Server(httpServer, {
            cors: {
                origin: '*', // Adjust according to your security policies
                methods: ['GET', 'POST'],
            },
        });

        this.handleConnection();
        this.handleSecureConnection();

        logger.info(`Socket.io server started (${NODE_ENV})`);
        return this.server;
    }

    private handleConnection() {
        this.server!.on('connection', (socket: Socket) => {
            logger.debug(`New connection: ${socket.id}`, socket.handshake.headers);

            socket.on('connect_error', async (err) => {
                logger.error('Error connecting socket: ', err);
                await AuthController.handleDisconnect(socket);
            });

            socket.on('disconnect', async (reason) => {
                logger.debug(`Client disconnected: ${socket.id}, Reason: ${reason}`);
                await AuthController.handleDisconnect(socket);
            });

            Router.register(socket);
        });
    }

    private handleSecureConnection() {
        this.server!.use(AuthMiddleware.authenticate);
    }

    public async kill(): Promise<void> {
        if (this.server) {
            return this.server.close();
        }
    }
}
