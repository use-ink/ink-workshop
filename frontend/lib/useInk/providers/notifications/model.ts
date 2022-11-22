import { Codec } from '@polkadot/types-codec/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { NotificationType } from '../../types';

// @public
export type NotificationPayload = {
  createdAt: number;
  type: NotificationType;
  result?: Codec | ISubmittableResult;
  message: string;
};

// @internal
export type AddNotificationPayload = {
  notification: Omit<NotificationPayload, 'createdAt'>;
};

// @internal
export type RemoveNotificationPayload = {
  notificationId: string;
};

// @public
export type Notification = { id: string } & NotificationPayload;

// @public
export type Notifications = Notification[];

export const DEFAULT_NOTIFICATIONS: Notifications = [];
