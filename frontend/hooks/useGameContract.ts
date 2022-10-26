import { useEffect, useMemo, useState } from 'react';
import ABI from '../constants/game/metadata.json';
import { useContract } from '../lib/useInk/hooks';
import { useUI } from '../contexts/UIContext';
import { useBlockSubscription } from '../lib/useInk/hooks/useBlockSubscription';
import { useInk } from '../lib/useInk';
import { Status } from '../lib/useInk/utils';
import BN from 'bn.js';

type AccountId = string;

// -1 for gas blows up so we need to set this really high for queries now...
const QUERY_GAS_LIMIT = 0; // new BN('10000000000000000000');

export const useGameContract = () => {
  const {
    game: { address },
  } = useUI();
  return useContract(address || '', ABI);
};

export type Dimensions = {
  x: number;
  y: number;
};

export const useDimensions = (): Dimensions | null => {
  const game = useGameContract();
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  useEffect(() => {
    game?.query?.dimensions('', {}).then((res) => {
      if (res.result.isOk) {
        const [x, y] = res.output?.toHuman() as string[];
        setDimensions({ x: parseInt(x), y: parseInt(y) });
      }
    });
  }, [game]);

  return dimensions;
};

export type Forming = {
  status: 'Forming';
  earliestStart: number;
  startingIn: number;
};

export type Running = {
  status: 'Running';
  startBlock: number;
  endBlock: number;
  totalRounds: number;
  currentRound: number;
};

export type Finished = {
  status: 'Finished';
  winner: AccountId;
};

export type GameStatus = 'Forming' | 'Running' | 'Finished';

export type GameState = Forming | Running | Finished;

const toRunningStatus = (gameState: any, header: number | undefined): Running => {
  const currentBlock = header || 0;

  const startBlock = parseInt(gameState?.Running.startBlock.split(',').join('')) || 0;
  const endBlock = parseInt(gameState?.Running.endBlock.split(',').join('')) || 0;
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

export const useGameState = (): GameState | null => {
  const game = useGameContract();
  const { header } = useInk();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const currentBlock = header?.number.toNumber() || 0;

  useBlockSubscription(() => {
    game?.query?.state('', {}).then((res) => {
      if (res.result.isOk) {
        const gs = res.output?.toHuman() as any;
        const phase = Object.keys(gs || {})[0];

        let state: GameState | null = null;
        if ('Forming'.toLocaleLowerCase() === phase.toLocaleLowerCase()) {
          const earliestStart = parseInt(gs?.Forming?.earliestStart.split(',').join('')) || 0;
          const startingIn = currentBlock < earliestStart ? earliestStart - currentBlock : 0;
          state = {
            status: 'Forming',
            earliestStart,
            startingIn,
          };
        }

        if ('Running'.toLocaleLowerCase() === phase.toLocaleLowerCase()) {
          state = toRunningStatus(gs, currentBlock);
        }

        if ('Finished'.toLocaleLowerCase() === phase.toLocaleLowerCase()) {
          const winner = gs?.[phase].winner;
          state = {
            status: 'Finished',
            winner,
          };
        }

        setGameState(state);
      }
    });
  });

  return gameState;
};

export const useBuyInAmount = (): BN | null => {
  const game = useGameContract();
  const [buyInAmount, setBuyInAmount] = useState<BN | null>(null);

  useBlockSubscription(() => {
    game?.query?.buyInAmount('', {}).then((res) => {
      if (res.result.isOk) {
        const amount = res.output?.toHuman()?.toString();
        amount && setBuyInAmount(new BN(amount.split(',').join('')));
      }
    });
  });

  return buyInAmount;
};

const PLAYER_COLORS = [
  '#6effdb',
  '#ff705e',
  '#5ea4ff',
  '#f3ff73',
  '#f9e3ff',
  '#f694ff',
  '#ffc32b',
  '#50d985',
  '#3853ff',
  '#bba4c2',
];

export type Player = {
  id: AccountId;
  name: string;
  gasUsed: number;
  lastTurn: number;
};

type Color = string;
type PlayerColors = {
  [id: AccountId]: Color;
};

export const usePlayerColors = (): PlayerColors => {
  const game = useGameContract();
  const [playerColors, setPlayerColors] = useState<PlayerColors>({});

  useBlockSubscription(() => {
    game?.query?.players('', {}).then((res) => {
      if (res.result.isOk) {
        const players = res.output?.toHuman() as Player[];
        const colors = players.reduce((acc, p, index) => {
          const colorIndex = index % PLAYER_COLORS.length;
          return { ...acc, [p.id]: PLAYER_COLORS[colorIndex] };
        }, {});
        setPlayerColors(colors);
      }
    });
  });

  return playerColors;
};

type Score = string;
export type PlayerScoreData = [Player, Score];

export type PlayerScore = Player & {
  score: Score;
  color: Color;
};

const toBN = (valWithCommas: string): BN => new BN(valWithCommas.split(',').join(''));

export const usePlayerScores = (): PlayerScore[] => {
  const game = useGameContract();
  const colors = usePlayerColors();
  const [scores, setScores] = useState<PlayerScore[]>([]);

  useBlockSubscription(() => {
    game?.query?.playerScores('', {}).then((res) => {
      if (res.result.isOk) {
        const s = res.output?.toHuman() as PlayerScoreData[];
        const sorted = [...s]
          .sort((a, b) => {
            try {
              return toBN(a[1]).lte(toBN(b[1])) ? 1 : 0;
            } catch (e) {
              return 1;
            }
          })
          .map((data, i) => ({
            ...data[0],
            score: data[1],
            color: colors[data[0].id],
          }));
        setScores(sorted);
      }
    });
  });

  return scores;
};

type XYCoordinate = [number, number];

export type BoardPositionRaw = null | [XYCoordinate, AccountId | null | undefined];
export type BoardPosition = {
  x: number;
  y: number;
  owner?: AccountId | null;
  color?: Color;
};

export const useBoard = (): BoardPosition[] => {
  const game = useGameContract();
  const dim = useDimensions();
  const colors = usePlayerColors();
  const [board, setBoard] = useState<BoardPosition[]>([]);

  useBlockSubscription(() => {
    dim &&
      game &&
      game?.query?.board('', {}).then((res) => {
        const data: BoardPosition[] = [];
        const raw = res.output?.toHuman() as (AccountId | null)[];

        let index = 0;
        for (let y = 0; y < dim.y; y += 1) {
          for (let x = 0; x < dim.x; x += 1) {
            const owner = raw?.[index];
            data.push({ x, y, owner, color: colors[owner || ''] });
            index += 1;
          }
        }
        setBoard(data);
      });
  });

  return board;
};

export type Response = {
  send: (...args: any[]) => void;
  status: Status;
  error?: string | null;
  resetState: () => void;
};

export const useSubmitTurnFunc = (): Response => {
  const game = useGameContract();
  const { activeAccount, activeSigner } = useInk();
  const [status, setStatus] = useState<Status>('none');
  const [error, setError] = useState<string | null>(null);

  const send = useMemo(
    () => (player: AccountId) => {
      if (!activeAccount || !game || !activeSigner || !player) return () => null;

      error && setError(null);
      setStatus('pending');

      game.query
        .submitTurn(activeAccount.address, { gasLimit: QUERY_GAS_LIMIT }, player)
        .then(({ gasRequired }) => {
          game.tx
            .submitTurn({ gasLimit: gasRequired }, player)
            .signAndSend(activeAccount.address, { signer: activeSigner.signer }, (result) => {
              if (result.status.isBroadcast) setStatus('broadcasted');
              if (result.status.isInBlock) setStatus('in-block');
              if (result.status.isFinalized) setStatus('finalized');
            })
            .catch((e) => {
              setStatus('none');
              console.error('error', JSON.stringify(e));
            });
        })
        .catch((e) => {
          setError(JSON.stringify(e));
          console.error('error', JSON.stringify(e));
        });
    },
    [activeAccount, activeSigner, game],
  );

  return {
    send,
    status,
    error,
    resetState: () => {
      setStatus('none');
      setError(null);
    },
  };
};

export const useRegisterPlayerFunc = (): Response => {
  const game = useGameContract();
  const { activeAccount, activeSigner } = useInk();
  const [status, setStatus] = useState<Status>('none');
  const [error, setError] = useState<string | null>(null);

  const send = useMemo(
    () => (player: AccountId, name: string, value: number) => {
      if (!activeAccount || !game || !activeSigner || !player) return () => null;

      error && setError(null);
      setStatus('pending');

      game.query
        .registerPlayer(activeAccount.address, { gasLimit: QUERY_GAS_LIMIT }, player, name)
        .then(({ gasRequired }) => {
          game.tx
            .registerPlayer({ gasLimit: gasRequired, value }, player, name)
            .signAndSend(activeAccount.address, { signer: activeSigner.signer }, (result) => {
              if (result.status.isBroadcast) setStatus('broadcasted');
              if (result.status.isInBlock) setStatus('in-block');
              if (result.status.isFinalized) setStatus('finalized');
            })
            .catch((e) => {
              setStatus('none');
              console.error('error', JSON.stringify(e));
            });
        })
        .catch((e) => {
          setError(JSON.stringify(e));
          console.error('error', JSON.stringify(e));
        });
    },
    [activeAccount, activeSigner, game],
  );

  return {
    send,
    status,
    error,
    resetState: () => {
      setStatus('none');
      setError(null);
    },
  };
};
