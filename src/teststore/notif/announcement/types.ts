import { BaseRequest } from 'npool-cli-v4'

/** @default "DefaultChannel" */
export enum NotifChannel {
  DefaultChannel = 'DefaultChannel',
  ChannelEmail = 'ChannelEmail',
  ChannelSMS = 'ChannelSMS',
}
export const NotifChannels = [
  NotifChannel.ChannelEmail,
  NotifChannel.ChannelSMS
]

export interface Announcement {
  ID: string;
  AppID: string;
  AppName: string;
  UserID: string;
  EmailAddress: string;
  PhoneNO: string;
  Username: string;
  Title: string;
  Content: string;
  AlreadyRead: boolean;
  AlreadySend: boolean;
  /** @format int64 */
  CreatedAt: number;
  /** if AlreadySend = true SendChannel valid */
  SendChannel: NotifChannel;
  Channels: NotifChannel[];
  /** @format int64 */
  EndAt: number;
}

export interface CreateAnnouncementRequest extends BaseRequest {
  AppID: string;
  Title: string;
  Content: string;
  Channels: NotifChannel[];
  /** @format int64 */
  EndAt: number;
}

export interface CreateAnnouncementResponse {
  Info: Announcement;
}

export interface DeleteAnnouncementRequest extends BaseRequest {
  ID: string;
}

export interface DeleteAnnouncementResponse {
  Info: Announcement;
}

export interface GetAnnouncementRequest extends BaseRequest {
  ID: string;
}

export interface GetAnnouncementResponse {
  Info: Announcement;
}

export interface GetAppAnnouncementsRequest extends BaseRequest {
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAppAnnouncementsResponse {
  Infos: Announcement[];
  /** @format int64 */
  Total: number;
}

export interface GetAnnouncementsRequest extends BaseRequest {
  AppID: string;
  UserID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetAnnouncementsResponse {
  Infos: Announcement[];
  /** @format int64 */
  Total: number;
}

export interface GetNAppAnnouncementsRequest extends BaseRequest {
  TargetAppID: string;
  /** @format int64 */
  Offset: number;
  /** @format int64 */
  Limit: number;
}

export interface GetNAppAnnouncementsResponse {
  Infos: Announcement[];
  /** @format int64 */
  Total: number;
}

export interface UpdateAnnouncementRequest extends BaseRequest {
  ID: string;
  Title: string;
  Content: string;
  Channels: NotifChannel[];
  /** @format int64 */
  EndAt: number;
}

export interface UpdateAnnouncementResponse {
  Info: Announcement;
}