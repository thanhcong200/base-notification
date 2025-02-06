import {  Emitter } from '@socket.io/redis-emitter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import logger from '@common/logger';
import { createServer, Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter, RedisAdapter as SocketRedisAdapter } from 'socket.io-redis';
import { IAuthUser, UserType } from '@common/constant';
import { IUser } from '@common/interface';
import { HELLO_USER } from './socket.event';


const PREFIX = 'eda_portal';

export class SocketService {
    private static _socketInstance: Server;
    private static _httpServerInstance: HttpServer;
    private static _emitter: Emitter;

    static async getEmitter(): Promise<Emitter> {
        if (!this._emitter) {
            SocketService._emitter = new Emitter(await RedisAdapter.connect(false), { key: PREFIX });
        }
        return SocketService._emitter;
    }

    static getHttpServer(): HttpServer {
        if (!SocketService._httpServerInstance) {
            SocketService._httpServerInstance = createServer();
        }
        return SocketService._httpServerInstance;
    }

    static async getSocketInstance(): Promise<Server> {
        if (SocketService._socketInstance) {
            return SocketService._socketInstance;
        }
        SocketService._socketInstance = new Server(SocketService.getHttpServer(), {
            allowEIO3: true,
            path: '/socket.io',
            adapter: createAdapter({
                pubClient: await RedisAdapter.connect(false),
                subClient: await RedisAdapter.connect(false),
                key: PREFIX,
            }),
        });

        return SocketService._socketInstance;
    }

    static async getSocketRedisAdapter(): Promise<SocketRedisAdapter> {
        return (await SocketService.getSocketInstance()).of('/').adapter as SocketRedisAdapter;
    }

    static getRoomName(type: UserType, userId: number): string {
        return type === UserType.USER ? `u_${userId}` : `ad_${userId}`;
    }

    static async helloUser(user: IUser, expiredAt: number): Promise<void> {
        const emitter = await SocketService.getEmitter();
        logger.debug(`Calling user ${user.id} for room`);
        const helloUserEventData = {
            name: "congvu",
            message: "hello"
        };
        emitter.to(SocketService.getRoomName(UserType.USER, user.id)).emit(HELLO_USER, helloUserEventData);
    }


    static async register(socket: Socket, user: IAuthUser): Promise<void> {
        return socket.join(SocketService.getRoomName(user.type, user.id));
    }

}
