import { ReactNode, useCallback, useEffect, useReducer } from 'react';
import { NotificationsContext } from './context';
import { AddNotificationPayload, DEFAULT_NOTIFICATIONS, RemoveNotificationPayload } from './model';
import { useIsMounted } from '../../hooks/useIsMounted';
import { nanoid } from 'nanoid';
import { notificationReducer } from './reducer';
import { useExtension } from '../../hooks/useExtension';

interface Props {
  children: ReactNode;
}

// @internal
export const NotificationsProvider = ({ children }: Props) => {
  const [notifications, dispatch] = useReducer(notificationReducer, DEFAULT_NOTIFICATIONS);
  const isMounted = useIsMounted();
  const { activeAccount } = useExtension();

  const addNotification = useCallback(
    ({ notification }: AddNotificationPayload) => {
      if (isMounted()) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          notification: { ...notification, id: nanoid(), createdAt: Date.now() },
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (activeAccount) {
      addNotification({
        notification: {
          message: activeAccount.meta.name || activeAccount.address,
          type: 'wallet-connected',
        },
      });
    }
  }, [activeAccount?.address]);

  const removeNotification = useCallback(
    ({ notificationId }: RemoveNotificationPayload) => {
      if (isMounted()) {
        dispatch({
          type: 'REMOVE_NOTIFICATION',
          notificationId,
        });
      }
    },
    [dispatch],
  );

  return (
    <NotificationsContext.Provider value={{ addNotification, notifications, removeNotification }} children={children} />
  );
};
