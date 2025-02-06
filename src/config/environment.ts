import path from 'path';
import dotenv from 'dotenv-safe';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
    allowEmptyValues: true
});

export const APP_NAME: string = process.env.APP_NAME || 'tracking';
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug';
export const LOG_OUTPUT_JSON: boolean = process.env.LOG_OUTPUT_JSON === '1';

export const PORT: number = parseInt(process.env.PORT, 10) || 3000;

export const MONGODB_URI: string = process.env.MONGODB_URI;

export const REDIS_URI: string = process.env.REDIS_URI;

export const USER_SERVICE_URL: string = process.env.USER_SERVICE_URL;
export const USER_SERVICE_API_KEY: string = process.env.USER_SERVICE_API_KEY;

export const SERVICE_API_KEYS: string[] = process.env.SERVICE_API_KEYS.split(',').filter((key) => key.trim() !== '');

export const KAFKA_BROKERS: string[] = process.env.KAFKA_BROKERS.split(',').filter((key) => key.trim() !== '');

// SMTP
export const EMAIL_FROM: string = process.env.EMAIL_FROM;
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST;
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS;
export const EMAIL_SMTP_PORT: number = parseInt(process.env.EMAIL_SMTP_PORT);
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER;