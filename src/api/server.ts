import express, { Express } from 'express';
import { createServer, Server } from 'http'; // Use createServer
import helmet from 'helmet';
import routes from '@api/router';
import logger from '@common/logger';
import { NODE_ENV } from '@config/environment';
import { ResponseMiddleware } from '@api/response.middleware';
express.response.sendJson = function (data: object) {
    return this.json({ error_code: 0, message: 'OK', ...data });
};
export class ExpressServer {
    private server: Express;
    private httpServer: Server;

    constructor() {
        this.server = express();
        this.httpServer = createServer(this.server); // Create HTTP server
    }

    public async setup(port: number): Promise<Server> {
        this.setupStandardMiddlewares();
        this.setupSecurityMiddlewares();
        this.configureRoutes();
        this.setupErrorHandlers();

        this.httpServer.listen(port, () => {
            logger.info(`Express server started on port ${port} (${NODE_ENV})`);
        });

        return this.httpServer; // Return the HTTP server instance
    }

    public async kill(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    private setupSecurityMiddlewares() {
        this.server.use(helmet());
    }

    private setupStandardMiddlewares() {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
    }

    private configureRoutes() {
        this.server.use(routes);
    }

    private setupErrorHandlers() {
        this.server.use(ResponseMiddleware.converter);
        this.server.use(ResponseMiddleware.notFound);
        this.server.use(ResponseMiddleware.handler);
    }
}
