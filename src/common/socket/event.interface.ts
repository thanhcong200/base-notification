import { PrivateRoomCloseReason, PrivateRoomStatus } from './../private-room/PrivateRoom';
import {
    CommunityMemberType,
    CommunityRoomRole,
    CommunityRoomStatus,
    ICommunityRoomResponse,
    ITypeMemberCommunity,
} from './../community-room/CommunityRoom';
import {
    CurrentGuideSelectionType,
    IRoomNoteResponse,
    ITranscriptDataResponse,
    ITypeMemberResponse,
    RoomTalkingType,
    RoomTranscriptStatus,
} from '@common/room/Room';
import { UserType } from '@common/auth/auth.interface';
import { Country } from '@config/multilanguage';
import { UserLevel } from '@common/user/User';
import { TopicScheduleTalkingType } from '@common/topic/TopicSchedule';
import { ITopicResponse } from '@common/topic/Topic';

export interface IRoomCallingEvent {
    id: string;
    name: string;
    topic_id: string;
    topic_title: string;
    topic_image: string;
    topic_content: string;
    role: string;
    expired_at: number;
    expired_in: number;
    talking_type?: RoomTalkingType;
}

export interface IMemberRoomEvent {
    id: number;
    member_id: number;
    room_id: string;
    role: UserType;
    name: string;
    avatar: string;
    triggered_at: number;
    moderator: ITypeMemberResponse;
    members: ITypeMemberResponse[];
    expired_in: number;
    level?: number;
    need_evaluate?: boolean;
    country?: Country;
    end_at?: number;
}

export interface IRoomClosedEvent {
    id: string;
    triggered_at: number;
    reason?: string;
    reason_code?: string;
}

export interface IRoomStartedEvent {
    id: string;
    triggered_at: number;
}

export interface IModOnlineStatusChangedEvent {
    moderator_id: number;
    status: number;
}

export interface IListenerChangedEvent {
    id: string;
    triggered_at: number;
    listener_count: number;
}

export interface IUserEvaluatedEvent {
    user_id: number;
    level: number;
    rated_at: number;
    moderator: {
        id: number;
        name: string;
        avatar: string;
    };
}

export interface IScheduleRoomCallingToConfirmParticipationEvent {
    id: string;
    topic_id: string;
    topic_title: string;
    topic_image: string;
    topic_content: string;
    role: string;
    expired_at: number;
    expired_in: number;
    topic_start_at: number;
    talking_type?: RoomTalkingType;
}

export interface IScheduleRoomCallingToConfirmParticipationBefore30minsEvent {
    id: string;
    topic_id: string;
    topic_title: string;
    topic_image: string;
    topic_content: string;
    role: string;
    expired_at: number;
    expired_in: number;
    topic_start_at: number;
    talking_type?: TopicScheduleTalkingType;
}

export interface ICurrentRoomGuideEvent {
    id: string;
    selection_type: CurrentGuideSelectionType;
    selection_id: string;
    triggered_at: number;
}

export interface IRoomNotesUpdatedEvent {
    id: string;
    room_notes: IRoomNoteResponse[];
    triggered_at: number;
}

export interface IRoomChangeTopic {
    id: string;
    topic: ITopicResponse;
    version: number;
    triggered_at: number;
}

export interface IRoomTranscriptUpdatedEvent {
    id: string;
    transcript_status: RoomTranscriptStatus;
    transcript_data: ITranscriptDataResponse;
    version: number;
    triggered_at: number;
}

// --------------------------------------------
// COMMUNITY ROOM
export interface ICommunityRoomStartEvent {
    room: ICommunityRoomResponse;
    triggered_at: number;
    status: CommunityRoomStatus;
}

export interface ICommunityRoomClosedEvent {
    community_room_id: string;
    triggered_at: number;
    reason?: string;
    status: CommunityRoomStatus;
    reason_code?: string;
}

export interface ICommunityRoomEventData {
    user_id: number;
    room_id: string;
    triggered_at: number;
    name?: string;
    avatar?: string;
    joined_at?: Date;
    country?: Country;
    role?: CommunityRoomRole;
    level?: UserLevel;
    history_id?: string;
    type?: CommunityMemberType;
    message?: string;
    version?: number;
    allow_camera?: boolean;
}

export interface ICommunityRoomUpdatedLobby {
    room_id: string;
    speakers: ITypeMemberCommunity[];
    audiences: ITypeMemberCommunity[];
    member_count: number;
    triggered_at: number;
}

export interface ICommunityRoomEventForGuest {
    room_id: string;
    member_guest_count: number;
}

export interface IPrivateRoomEventData {
    user_id: number;
    room_id: string;
    triggered_at: number;
    message: string;
    version: number;
    status: PrivateRoomStatus;
}

export type IPrivateRoomMemberLeftEventData = IPrivateRoomEventData;

export interface IPrivateRoomMemberJoinedEventData extends IPrivateRoomEventData {
    name: string;
    avatar: string;
    joined_at: number;
    country: Country;
    level: number;
    history_id: string;
}

export interface IPrivateRoomMemberNoReplyEventData extends IPrivateRoomEventData {
    name: string;
    avatar: string;
}

export interface IPrivateRoomChangedTopicEventData extends IPrivateRoomEventData {
    name: string;
    avatar: string;
    topic_id: string;
}

export interface IPrivateRoomClosedEvent {
    room_id: string;
    triggered_at: number;
    status?: PrivateRoomStatus;
    reason?: PrivateRoomCloseReason;
    reason_code?: PrivateRoomCloseReason;
    version?: number;
}

export interface IPrivateRoomCallingEvent {
    room_id: string;
    caller_id: number;
    caller_name: string;
    caller_avatar: string;
    topic_id?: string;
    topic_title?: string;
    expired_at: number;
    expired_in: number;
}
