import { useMemo } from 'react';
import { useGame } from '../../contexts/GameContext';
import { ContractEvent } from '../../lib/useInk/providers/contractEvents/model';
import { EventName } from './types';

export const useGameEvents = (eventName?: EventName): ContractEvent[] => {
  const { events } = useGame();
  return useMemo(() => {
    if (!eventName) return events;
    return events.filter((e) => e.name === eventName);
  }, [events, eventName]);
};
