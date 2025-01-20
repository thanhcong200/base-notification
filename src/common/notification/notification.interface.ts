import { Language, Country } from '@common/constant';
import { IEventData } from '@common/event-data';
import Handlebars, { TemplateDelegate } from 'handlebars';
import { INotification } from './notification.schema';

export enum NotificationType {
    // Other
    OTHER = 0,

    USER_SIGN_UP_TRIAL_PACKAGE = 16,
}

export enum NotificationGroupType {
    NONE = 'none',
    ROOM = 'room',
}

export interface ITemplateLanguage {
    [Language.VI]: TemplateDelegate;
    [Language.EN]: TemplateDelegate;
}

export interface INotificationTemplate {
    icon: string;
    title: ITemplateLanguage;
    content: ITemplateLanguage;
}

export const NotificationTemplates = new Map<NotificationType, INotificationTemplate>();

NotificationTemplates.set(NotificationType.USER_SIGN_UP_TRIAL_PACKAGE, {
    icon: '',
    title: {
        vi: Handlebars.compile('CongVu'),
        en: Handlebars.compile('CongVu'),
    },
    content: {
        vi: Handlebars.compile(`Woohoo! Hello <b>{{{ escape subs.0.name }}}</b> ❤️`),
        en: Handlebars.compile(`Woohoo! Hello <b>{{{ escape subs.0.name }}}</b> ❤️`),
    },
});

export interface INotificationTransformerConstructor {
    getType(): NotificationType;
    make(data: IEventData): INotificationTransformer;
}

export interface INotificationTransformer {
    getKey(): Buffer;
    transform(lang: Language, notification: INotification, country?: Country): INotification;
}
