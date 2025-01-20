export enum TopicName {
    USER = 'user'
}

export enum EventKey {}

export enum EventName {
    USER__SIGN_UP_TRIAL_PACKAGE = 'sign_up_trial_package',
}

export interface IEventTopic {
    event: string;
    topic: TopicName;
}

export const EventTopics: Map<EventKey, IEventTopic> = new Map();

// EventTopics.set(EventKey.PURCHASED_PACKAGE__CREATE, { topic: TopicName.PURCHASED_PACKAGE, event: 'create' });
