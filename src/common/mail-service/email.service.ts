import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { EMAIL_FROM, EMAIL_SMTP_HOST, EMAIL_SMTP_PASS, EMAIL_SMTP_PORT, EMAIL_SMTP_USER } from '@config/environment';
import logger from '@common/logger';

const ALLOWED_LANGUAGES = ['en'];
const DEFAULT_LANGUAGE = 'en';

export enum EmailTemplate {
    USER_REGISTER = 'user.register',
    USER_FORGOT_PASSWORD = 'user.forgot_password',
    MODERATOR_REGISTER = 'user.register',
    MODERATOR_FORGOT_PASSWORD = 'user.forgot_password',
    USER_AUTOPAY_REGISTER = 'user.autopay_register',
    USER_REMIND_EXISTS_ACCOUNT = 'user.remind_exists_account',
}

export interface IEmailParams {
    email: string;
    template: EmailTemplate;
    name: string;
    lang?: string;
    data?: unknown;
}

const transporter = nodemailer.createTransport({
    host: EMAIL_SMTP_HOST,
    secure: EMAIL_SMTP_PORT === 465,
    port: EMAIL_SMTP_PORT,
    auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS,
    },
});

const templates = new Map<string, HandlebarsTemplateDelegate>();

ALLOWED_LANGUAGES.forEach((lang) => {
    fs.readdir(path.join(__dirname, `../../../templates/${lang}`), (err, filenames) => {
        if (err) {
            logger.error(`Cannot load templates ${lang}: `, err);
            return;
        }
        filenames.forEach((filename) => {
            fs.readFile(path.join(__dirname, `../../../templates/${lang}/${filename}`), 'utf-8', (erro, content) => {
                if (erro) {
                    logger.error(`Cannot load template ${lang} - ${filename}: `, erro);
                    return;
                }
                templates.set(`${lang}.${filename}`, handlebars.compile(content));
            });
        });
    });
});

export class EmailService {
    /**
     * Send email
     * @param email
     * @param subject
     * @param html
     * @param text
     */
    static async send(email: string, subject: string, html: string, text: string): Promise<void> {
        logger.debug(`Sending email for ${email}`);
        await transporter.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject,
            text,
            html,
        });
        logger.debug(`Sent email successfully for ${email}`);
    }

    /**
     * Send email
     * @param params
     */
    static async sendEmail(params: IEmailParams): Promise<void> {
        if (!ALLOWED_LANGUAGES.includes(params.lang)) {
            params.lang = DEFAULT_LANGUAGE;
        }
        const subjectTemplate = templates.get(`${params.lang}.${params.template}.subject.txt`);
        if (!subjectTemplate) {
            logger.error(`Cannot load subject template: `, params);
            throw new Error('Cannot load subject template');
        }
        const htmlTemplate = templates.get(`${params.lang}.${params.template}.body.html`);
        if (!htmlTemplate) {
            logger.error(`Cannot load html template: `, params);
            throw new Error('Cannot load html template');
        }
        const textTemplate = templates.get(`${params.lang}.${params.template}.body.txt`);
        if (!textTemplate) {
            logger.error(`Cannot load text template: `, params);
            throw new Error('Cannot load text template');
        }
        return EmailService.send(params.email, subjectTemplate(params), htmlTemplate(params), textTemplate(params));
    }
}
