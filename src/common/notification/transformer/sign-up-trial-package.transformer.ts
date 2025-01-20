
import { IEventData } from '@common/event-data';
import { get } from 'lodash';
import { INotificationTransformer, NotificationTemplates, NotificationType } from '../notification.interface';
import { INotification, INotificationData, INotificationMeta } from '../notification.schema';
import { Language } from '@common/constant';


export class UserSignUpTrialPackageTransformer implements INotificationTransformer {
    private data: IEventData;

    constructor(data: IEventData) {
        this.data = data;
    }

    public static getType(): NotificationType {
        return NotificationType.USER_SIGN_UP_TRIAL_PACKAGE;
    }

    public static make(data: IEventData): INotificationTransformer {
        return new UserSignUpTrialPackageTransformer(data);
    }

    public getKey(): Buffer {
        return Buffer.from("1");
    }

    public transform(lang: Language, notification: INotification): INotification {
        const template = NotificationTemplates.get(UserSignUpTrialPackageTransformer.getType());

        const data: INotificationData = {
            subs: [],
            di_obj: get(this.data.di_obj, 'id', ''),
        };

        const meta: INotificationMeta[] = [
            {
                _id: get(this.data.di_obj, 'id', ''),
                name: get(this.data.di_obj, 'data.total_session', ''),
                tz: new Date(get(this.data.di_obj, 'data.updated_at', '')),
            },
        ];

        notification.url = `notification://profile/info`;

        notification.icon = template.icon;
        notification.data = data;
        notification.meta = meta;

        notification.compile(lang, template);

        return notification;
    }
}
