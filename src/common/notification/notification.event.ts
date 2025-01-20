
import eventbus from '@common/event-bus';

export const EVENT_USER_NOTIFICATION_CREATED = 'event_user_notification_created';
export const EVENT_MODERATOR_NOTIFICATION_CREATED = 'event_moderator_notification_created';
export const EVENT_USER_LANGUAGE_CHANGED = 'event_user_language_changed';
export const EVENT_NOTIFICATION_LOG_CREATED = 'event_notification_log_created';
export const EVENT_MANY_USER_NOTIFICATION_CREATED = 'event_many_user_notification_created';
export const EVENT_MANY_MOD_NOTIFICATION_CREATED = 'event_many_mod_notification_created';

export class NotificationEvent {
    /**
     * Register notification event
     */
    static register(): void {
       console.log(
        "hihi"
       )
    }
}
