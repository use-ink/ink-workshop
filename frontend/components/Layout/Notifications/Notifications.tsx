import React from 'react';
import { useGame } from '../../../contexts/GameContext';
import { usePlayers } from '../../../hooks/useGameContract';
import { TurnEvent } from '../../../hooks/useGameEvents';
import { useNotifications } from '../../../lib/useInk/hooks/useNotifications';
import { Status } from '../../../lib/useInk/types';
import { Snackbar, SnackbarType } from '../../Snackbar';

type NotificationKind = Status | 'WalletConnected';

const NOTIFICATION_TYPES: { [k in NotificationKind]: SnackbarType } = {
  WalletConnected: 'info',
  None: 'info',
  PreFlight: 'info',
  PendingSignature: 'info',
  Broadcast: 'info',
  InBlock: 'success',
  Finalized: 'success',
  Errored: 'error',
  Future: 'info',
  Ready: 'info',
  Retracted: 'error',
  FinalityTimeout: 'error',
  Usurped: 'warning',
  Dropped: 'warning',
  Invalid: 'error',
};

export const Notifications = () => {
  const { notifications } = useNotifications();
  const { playerTurnEvents } = useGame();
  const names = usePlayers();

  const toEventMessage = (event: TurnEvent): string => {
    const playerName = names[event.player] ? names[event.player] : '';

    switch (event.name) {
      case 'Success':
        return `${playerName} scored!`;
      case 'BrokenPlayer':
        return `${playerName} has a broken contract!`;
      case 'Occupied':
        return `${playerName} collided with (${event.turn.x}, ${event.turn.y})!`;
      case 'OutOfBounds':
        return `${playerName} is out of bounds! (${event.turn.x}, ${event.turn.y})!`;
      default:
        return '';
    }
  };

  return (
    <ul className="fixed right-[150px] bottom-24 z-10">
      {playerTurnEvents.map((e) => (
        <li key={e.id} className="mt-1">
          <Snackbar
            message={toEventMessage(e)}
            type={e.name === 'Success' ? NOTIFICATION_TYPES.Finalized : NOTIFICATION_TYPES.Errored}
            show
          />
        </li>
      ))}

      {notifications.map((n) => (
        <li key={n.id} className="mt-1">
          <Snackbar message={n.message} type={NOTIFICATION_TYPES[n.type]} show />
        </li>
      ))}
    </ul>
  );
};
