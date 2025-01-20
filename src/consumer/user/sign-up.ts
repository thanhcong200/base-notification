import { Language } from '@common/constant';
import { EventData } from '@common/event-data';
import logger from '@common/logger';
import { NotificationType } from '@common/notification/notification.interface';
import { NotificationService } from '@common/notification/notification.service';
import { TopicName, EventName } from '@common/topic/user';
import { KafkaMessage } from 'kafkajs';
import { get } from 'lodash';

export class UserSignUpTrialPackageHandler {
    static getName(): string {
        return 'UserSignUpTrialPackageHandler';
    }
    static getTopic(): string {
        return TopicName.USER;
    }
    static getEvents(): string[] {
        return [EventName.USER__SIGN_UP_TRIAL_PACKAGE];
    }
    static match(topic: string, message: KafkaMessage): boolean {
        if (topic !== UserSignUpTrialPackageHandler.getTopic()) {
            return false;
        }
        const headers = message.headers;
        if (!headers || !headers.event) {
            return false;
        }
        return UserSignUpTrialPackageHandler.getEvents().includes(headers.event.toString());
    }
    static async process(
        topic: string,
        partition: number,
        message: KafkaMessage,
        parsedMessage: EventData,
    ): Promise<void> {
        logger.debug('Processing message', { parsedMessage });

        const userId = get(parsedMessage.pr_obj, 'data._id', 0);
        if (!userId) {
            logger.error('Missing user_id', { parsedMessage });
            return;
        }

        await NotificationService.createUserNotification(
            userId,
            NotificationType.USER_SIGN_UP_TRIAL_PACKAGE,
            parsedMessage,
            Language.VI,
        );

        return;
    }
}
