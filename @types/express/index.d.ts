/* eslint-disable @typescript-eslint/ban-types */
import { IAuthUser } from '@common/auth/auth.interface';
import { INotification } from '@common/notification/notification.schema';

declare global {
    namespace Express {
        interface Request {
            locals: {
                query?: object;
                notification?: INotification;
            };
            user?: IAuthUser;
        }

        interface Response {
            sendJson(data: unknown): this;
        }
    }
}

export {};
