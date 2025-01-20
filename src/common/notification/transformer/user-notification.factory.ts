import { IEventData } from "@common/event-data";
import { NotificationType, INotificationTransformerConstructor, INotificationTransformer } from "../notification.interface";
import { UserSignUpTrialPackageTransformer } from "./sign-up-trial-package.transformer";


const Transformers = new Map<NotificationType, INotificationTransformerConstructor>();


Transformers.set(NotificationType.USER_SIGN_UP_TRIAL_PACKAGE, UserSignUpTrialPackageTransformer);

export class UserNotificationFactory {
    static make(type: NotificationType, data: IEventData): INotificationTransformer {
        return Transformers.get(type).make(data);
    }
}
