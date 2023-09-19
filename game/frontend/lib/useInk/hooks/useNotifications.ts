import { useContext, useMemo } from 'react';
import { HALF_A_SECOND } from '../constants';
import { NotificationsContext } from '../providers/notifications/context';
import { Notification } from '../providers/notifications/model';
import { getExpiredItem } from '../utils/getExpiredItem';
import { useConfig } from './useConfig';
import { useExtension } from './useExtension';
import { useInterval } from './useInterval';

export function useNotifications() {
  const { activeAccount: account } = useExtension();
  const { addNotification, notifications, removeNotification } = useContext(NotificationsContext);
  const config = useConfig();

  const parachainNotifications = useMemo(() => {
    if (!account) return [];
    return notifications ?? [];
  }, [notifications, account]);

  useInterval(() => {
    const expiredNotifications = getExpiredItem<Notification>(parachainNotifications, config.notifications?.expiration);
    for (const notification of expiredNotifications) {
      removeNotification({ notificationId: notification.id });
    }
  }, config.notifications?.checkInterval || HALF_A_SECOND);

  return {
    notifications: parachainNotifications,
    addNotification,
    removeNotification,
  };
}
