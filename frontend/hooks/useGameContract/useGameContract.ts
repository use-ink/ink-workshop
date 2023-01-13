import { useEffect, useMemo, useState } from 'react';
import BN from 'bn.js';
import { useGame } from '../../contexts/GameContext';
import { useBlockHeader, useContractTx, useNotifications } from '../../lib/useInk/hooks';
import { useContractCallDecoded } from '../../lib/useInk/hooks/useContractCallDecoded';
import {
  AccountId,
  BoardPosition,
  Dimensions,
  Field,
  Forming,
  GameState,
  Player,
  PlayerColors,
  PlayerList,
  PlayerScore,
  PlayerScoreData,
  Running,
} from './types';
import { ContractTxFunc } from '../../lib/useInk/types';
import { PLAYER_COLORS } from './data';
import { isBroadcasting, isFinalized, stringNumberToBN } from '../../lib/useInk/utils';
import { useUI } from '../../contexts/UIContext';
import { useAudioSettings } from '../useAudioSettings';
import { useTranslation } from 'react-i18next';
import { useLanguageSettings } from '../useLanguageSettings';

function pickOne<T>(messages: T[]): T {
  return messages[new Date().getTime() % messages.length];
}

export const useGameContract = () => useGame().game;

export const useDimensions = (): Dimensions | null => {
  const game = useGameContract();
  const decoded = useContractCallDecoded<Field>(game, 'dimensions');
  if (!decoded || !decoded.ok) return null;

  return { x: parseInt(decoded.value.result.x), y: parseInt(decoded.value.result.y) };
};

const toRunningStatus = (gameState: any, blockNumber: number | undefined): Running => {
  const currentBlock = blockNumber || 0;

  const startBlock = stringNumberToBN(gameState.Running.startBlock).toNumber() || 0;
  const endBlock = stringNumberToBN(gameState.Running.endBlock).toNumber() || 0;
  const totalRounds = gameState ? endBlock - startBlock : 0;
  const hasEnded = endBlock < currentBlock;
  const currentRound = hasEnded ? totalRounds : currentBlock - startBlock;

  return {
    status: 'Running',
    startBlock,
    endBlock,
    totalRounds,
    currentRound,
  };
};

const toFormingStatus = (gameState: any, currentBlock: number): Forming => {
  const earliestStart = stringNumberToBN(gameState.Forming?.earliestStart).toNumber() || 0;
  const startingIn = currentBlock < earliestStart ? earliestStart - currentBlock : 0;

  return {
    status: 'Forming',
    earliestStart,
    startingIn,
  };
};

export const useGameState = (): GameState | null => {
  const game = useGameContract();
  const { blockNumber } = useBlockHeader();
  const currentBlock = blockNumber || 0;
  const [gameState, setGameState] = useState<GameState | null>(null);
  const result = useContractCallDecoded<any>(game, 'state');

  const phase = result && result.ok ? Object.keys(result.value.result || {})[0] || '' : '';

  useMemo(() => {
    if (!result || !result.ok) return null;

    switch (phase.toLowerCase()) {
      case 'forming':
        setGameState(toFormingStatus(result.value.result, currentBlock));
        break;

      case 'running':
        setGameState(toRunningStatus(result.value.result, currentBlock));
        break;

      case 'finished':
        setGameState({
          status: 'Finished',
          winner: result.value.result?.[phase].winner,
        });
    }
  }, [phase, currentBlock]);

  return gameState;
};

export const useBuyInAmount = (): BN | null => {
  const game = useGameContract();
  const decoded = useContractCallDecoded<string>(game, 'buyInAmount');

  return useMemo(() => {
    if (decoded && decoded.ok) {
      return stringNumberToBN(decoded.value.result);
    }

    return null;
  }, [decoded]);
};

export const usePlayerColors = (): PlayerColors => {
  const game = useGameContract();
  const decoded = useContractCallDecoded<Player[]>(game, 'players');

  return useMemo(() => {
    if (decoded && decoded.ok && decoded.value) {
      return decoded.value.result.reduce((acc, p, index) => {
        const colorIndex = index % PLAYER_COLORS.length;
        return { ...acc, [p.id]: PLAYER_COLORS[colorIndex] };
      }, {});
    }

    return [];
  }, [decoded]);
};

export const usePlayerScores = (): PlayerScore[] => {
  const game = useGameContract();
  const colors = usePlayerColors();
  const result = useContractCallDecoded<PlayerScoreData[]>(game, 'playerScores');

  return useMemo(() => {
    if (result && result.ok) {
      return [...result.value.result]
        .sort((a, b) => {
          try {
            return stringNumberToBN(a[1]).lte(stringNumberToBN(b[1])) ? 1 : 0;
          } catch (e) {
            return 1;
          }
        })
        .map((data, i) => ({
          ...data[0],
          score: data[1],
          color: colors[data[0].id],
        }));
    }

    return [];
  }, [result]);
};

export const usePlayers = (): PlayerList => {
  const scores = usePlayerScores();

  return useMemo(() => {
    const p: PlayerList = {};
    for (let i = 0; i < scores.length; i++) {
      const { id, name } = scores[i] || {};
      p[id] = name;
    }
    return p;
  }, [scores]);
};

export const usePlayerName = (): string => {
  const scores = usePlayerScores();
  const { player } = useUI();

  return useMemo(() => {
    const p = scores.find((score) => score.id === player);
    return p ? p.name : '';
  }, [scores]);
};

export const useBoard = (): BoardPosition[] => {
  const game = useGameContract();
  const dim = useDimensions();
  const colors = usePlayerColors();
  const result = useContractCallDecoded<(AccountId | null)[]>(game, 'board');

  return useMemo(() => {
    if (dim && result && result.ok) {
      const data: BoardPosition[] = [];

      let index = 0;
      for (let y = 0; y < dim.y; y += 1) {
        for (let x = 0; x < dim.x; x += 1) {
          const owner = result.value.result?.[index];
          data.push({ x, y, owner, color: colors[owner || ''] });
          index += 1;
        }
      }

      return data;
    }
    return [];
  }, [dim, result, result?.ok, colors]);
};

export const useSubmitTurnFunc = (): ContractTxFunc => {
  const game = useGameContract();
  const commonTranslation = useTranslation('common');
  const eventTranslation = useTranslation('events');
  const { addNotification } = useNotifications();
  const { sendEffect } = useAudioSettings();
  const submitTurnFunc = useContractTx(game, 'submitTurn', { notificationsOff: true });
  const {
    languageTrack: { locale },
  } = useLanguageSettings();

  const resouces =
    useMemo(() => eventTranslation.i18n.getResourceBundle(locale, 'events'), [locale, eventTranslation]) || {};

  useEffect(() => {
    if (isBroadcasting(submitTurnFunc)) {
      sendEffect?.play();

      const successIndex = Math.floor(Math.random() * (Object.values(resouces?.turnSubmitted).length - 1));
      const message = eventTranslation.t(`turnSubmitted.${successIndex}`);

      addNotification({
        notification: {
          type: 'Broadcast',
          result: submitTurnFunc.result,
          message,
        },
      });
      return;
    }

    if (isFinalized(submitTurnFunc)) {
      addNotification({
        notification: {
          type: 'Finalized',
          result: submitTurnFunc.result,
          message: commonTranslation.t('blockFinalized'),
        },
      });
    }
  }, [submitTurnFunc.status]);

  return submitTurnFunc;
};

export const useRegisterPlayerFunc = () => {
  const game = useGameContract();
  const { t } = useTranslation('common');

  return useContractTx(game, 'registerPlayer', {
    notifications: {
      finalizedMessage: () => t('blockFinalized'),
      inBlockMessage: () => t('inBlock'),
      broadcastMessage: () => t('broadcast'),
      unknownErrorMessage: () => t('somethingWentWrong'),
    },
  });
};
