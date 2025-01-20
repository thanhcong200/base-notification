import { Language } from '@common/constant';
import { NotificationType, NotificationGroupType, INotificationTemplate } from './notification.interface';
import Handlebars from 'handlebars';

const HIGHLIGHT_TEMPLATE = /<b>([^<>]*)<\/b>/gi;
const HIGHLIGHT_TEMPLATE_LENGTH = 7;

const CHAR_LT = 17;
const CHAR_GT = 18;

function escape(value) {
    if (typeof value === 'string') {
        return value.replace('<', String.fromCharCode(CHAR_LT)).replace('>', String.fromCharCode(CHAR_GT));
    }
    return value;
}

function unescape(value) {
    if (typeof value === 'string') {
        return value.replace(String.fromCharCode(CHAR_LT), '<').replace(String.fromCharCode(CHAR_GT), '>');
    }
    return value;
}

Handlebars.registerHelper({
    eq: (v1, v2) => {
        return v1 === v2;
    },
    ne: (v1, v2) => {
        return v1 !== v2;
    },
    lt: (v1, v2) => {
        return v1 < v2;
    },
    gt: (v1, v2) => {
        return v1 > v2;
    },
    lte: (v1, v2) => {
        return v1 <= v2;
    },
    gte: (v1, v2) => {
        return v1 >= v2;
    },
    escape,
});

Handlebars.registerHelper('math', function math(lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
    }[operator];
});

function renderMessage(message: string): INotificationContent {
    let highlights = [];
    const text = message.replace(HIGHLIGHT_TEMPLATE, (match, p1, offset) => {
        highlights.push({ offset, length: p1.length });
        return p1;
    });
    highlights = highlights.map((highlight, index) => {
        highlight.offset -= HIGHLIGHT_TEMPLATE_LENGTH * index;
        return highlight;
    });

    return { text: unescape(text), highlights };
}

interface ICompiledData {
    subs: INotificationMeta[];
    di_obj?: INotificationMeta;
    in_obj?: INotificationMeta;
    pr_obj?: INotificationMeta;
    ctx?: INotificationMeta;
}

export enum NotificationStatus {
    UNSEEN_AND_UNREAD = 0,
    SEEN_BUT_UNREAD = 1,
    SEEN_AND_READ = 2,
}

interface IHighlight {
    offset: number;
    length: number;
}

interface INotificationContent {
    text: string;
    highlights: IHighlight[];
}

export interface INotificationResponse {
    id: string;
    auth_id: number;
    type: NotificationType;
    image: string;
    icon: string;
    url: string;
    title: string;
    content: INotificationContent;
    received_at: number;
    read_at?: number;
    status: NotificationStatus;
    group_type?: NotificationGroupType
}

export interface INotificationData {
    subs: string[];
    di_obj?: string;
    in_obj?: string;
    pr_obj?: string;
    ctx?: string;
}

export interface INotificationMeta {
    _id: string;
    name?: string;
    image?: string;
    tz: Date;
}


export interface INotification {
    _id: string;
    auth_id: number;
    image: string;
    icon: string;
    url: string;
    title: string;
    content: INotificationContent;
    data?: INotificationData;
    meta: INotificationMeta[];
    max_meta_tz?: Date;
    compiled_at: Date;
    received_at: Date;
    last_received_at: Date;
    group_type?: NotificationGroupType;
    read_at?: Date;
    dirty?: boolean;
    type: NotificationType;
    key: Buffer;
    status: NotificationStatus;
    created_at: Date;
    updated_at: Date;

    getCompiledData(): unknown;
    compile(lang: Language, template: INotificationTemplate): void;
    transform(): INotificationResponse;
}
