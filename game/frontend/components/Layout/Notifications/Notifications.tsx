import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../../contexts/GameContext';
import { usePlayers } from '../../../hooks/useGameContract';
import { PlayerRegistered, TurnEvent } from '../../../hooks/useGameEvents';
import { useLanguageSettings } from '../../../hooks/useLanguageSettings';
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
  const { playerTurnEvents, playerRegisteredEvents } = useGame();
  const names = usePlayers();
  const eventTranslation = useTranslation('events');
  const {
    languageTrack: { locale },
  } = useLanguageSettings();
  const { t } = eventTranslation;
  const resouces =
    useMemo(() => eventTranslation.i18n.getResourceBundle(locale, 'events'), [locale, eventTranslation]) || {};

  const toEventMessage = (event: TurnEvent): string => {
    const player = names[event.player] ? names[event.player] : '';

    switch (event.name) {
      case 'Success':
        const successIndex = Math.floor(Math.random() * (Object.values(resouces?.playerScored).length - 1));
        return t(`playerScored.${successIndex}`, { player });
      case 'BrokenPlayer':
        const brokenIndex = Math.floor(Math.random() * (Object.values(resouces?.brokenPlayer).length - 1));
        return t(`brokenPlayer.${brokenIndex}`, { player });
      case 'Occupied':
        const occupiedIndex = Math.floor(Math.random() * (Object.values(resouces?.playerCollision).length - 1));
        return t(`playerCollision.${occupiedIndex}`, { player, x: event.turn.x, y: event.turn.y });
      case 'OutOfBounds':
        const outOfBoundsIndex = Math.floor(Math.random() * (Object.values(resouces?.playerOutOfBounds).length - 1));
        return t(`playerOutOfBounds.${outOfBoundsIndex}`, { player, x: event.turn.x, y: event.turn.y });
      default:
        return '';
    }
  };

  const toPlayerRegisteredMessage = (event: PlayerRegistered): string => {
    const player = names[event.player] ? names[event.player] : '';
    const successIndex = Math.floor(Math.random() * (Object.values(resouces?.playerScored).length - 1));
    return t(`playerJoined.${successIndex}`, { player });
  };

  return (
    <ul className="fixed right-[150px] bottom-24 z-10">
      {playerRegisteredEvents.map((registeredEvent) => (
        <li key={registeredEvent.player} className="mt-1">
          <Snackbar message={toPlayerRegisteredMessage(registeredEvent)} type="info" show />
        </li>
      ))}

      {playerTurnEvents.map((turnEvent) => (
        <li key={turnEvent.id} className="mt-1">
          <Snackbar
            message={toEventMessage(turnEvent)}
            type={turnEvent.name === 'Success' ? NOTIFICATION_TYPES.Finalized : NOTIFICATION_TYPES.Errored}
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
