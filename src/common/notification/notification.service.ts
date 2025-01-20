import { Language, Country } from "@common/constant";
import eventbus from "@common/event-bus";
import { IEventData } from "@common/event-data";
import { NotificationType } from "./notification.interface";
import { INotification, NotificationStatus } from "./notification.schema";
import { EVENT_USER_NOTIFICATION_CREATED } from "./notification.event";
import { UserNotificationFactory } from "./transformer/user-notification.factory";



export class NotificationService {

    static async createUserNotification(
        userId: number,
        type: NotificationType,
        data: IEventData,
        lang: Language,
        country?: Country,
    ): Promise<INotification> {
        const transformer = UserNotificationFactory.make(type, data);

        const key = transformer.getKey();


        let notification = null
        notification.last_received_at =  null;
        notification.received_at = new Date();
        notification.status = NotificationStatus.UNSEEN_AND_UNREAD;
        notification = transformer.transform(lang, notification, country);

        eventbus.emit(EVENT_USER_NOTIFICATION_CREATED, notification);
        return notification;
    }


    static async pushUserNotification(
        userId: number,
        type: NotificationType,
        data: IEventData,
        lang: Language,
    ): Promise<INotification> {
       // send noti for user
       return null;
    }

}
