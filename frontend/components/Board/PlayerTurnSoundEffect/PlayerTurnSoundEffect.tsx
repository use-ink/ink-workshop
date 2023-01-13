import { useEffect } from 'react';
import { useUI } from '../../../contexts/UIContext';
import { useAudioSettings } from '../../../hooks/useAudioSettings';
import { TurnEvent } from '../../../hooks/useGameEvents';

type Props = {
  turn: TurnEvent;
};

export const PlayerTurnSoundEffect: React.FC<Props> = ({ turn }) => {
  const { finalizedEffect, failureEffect } = useAudioSettings();
  const { player } = useUI();

  useEffect(() => {
    if (turn.name === 'BrokenPlayer') failureEffect?.play();
    if (turn.name === 'OutOfBounds') failureEffect?.play();
    if (turn.name === 'Success' && player === turn.player) {
      setTimeout(() => finalizedEffect?.play(), 500);
    }
  }, [turn, failureEffect, finalizedEffect]);

  return null;
};
