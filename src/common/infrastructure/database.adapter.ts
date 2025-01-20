import mongoose, { ConnectionOptions } from 'mongoose';
import bluebird from 'bluebird';
import { LOG_LEVEL, LOG_OUTPUT_JSON, MONGODB_URI } from '@config/environment';
import logger from '@common/logger';
mongoose.Promise = bluebird;
if (LOG_LEVEL === 'debug') {
    if (LOG_OUTPUT_JSON) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            logger.debug(`Mongoose: ${collectionName}.${method}`, { stringData: JSON.stringify(query) });
        });
    } else {
        mongoose.set('debug', true);
    }
}

/**
 * Singleton Database client
 */
export class DatabaseAdapter {
    static async connect(): Promise<void> {
        try {
            const options: ConnectionOptions = {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                keepAlive: true,
            };
            await mongoose.connect(MONGODB_URI, options);
            logger.info('Connect to mongodb successfully!');
        } catch (error) {
            logger.error('Connect to mongodb failed!', error);
            // Exit process with failure
            process.exit(1);
        }
    }

    static async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            logger.info('Disconnect from mongodb successfully!');
        } catch (error) {
            logger.error('Disconnect from mongodb failed!', error);
        }
    }
}
