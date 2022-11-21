import React from 'react';
import { useNotifications } from '../../../lib/useInk/hooks/useNotifications';
import { Snackbar, SnackbarType } from '../../Snackbar';

const NOTIFICATION_TYPES: { [k: string]: SnackbarType } = {
  none: 'info',
  'pre-flight-started': 'info',
  'pre-flight-completed': 'success',
  'signature-requested': 'info',
  broadcasted: 'info',
  'added-to-block': 'success',
  'wallet-connected': 'success',
  finalized: 'success',
  errored: 'error',
};

export const Notifications = () => {
  const { notifications } = useNotifications();

  return (
    <ul className="fixed right-3 bottom-24 z-10">
      {notifications.map((n) => (
        <li key={n.id} className="mt-1">
          <Snackbar message={n.message} type={NOTIFICATION_TYPES[n.type]} show />
        </li>
      ))}
    </ul>
  );
};
