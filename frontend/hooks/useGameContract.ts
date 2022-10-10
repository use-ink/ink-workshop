import { useState } from 'react';
import { ABI } from '../constants';
import { useContract } from '../lib/useInk/hooks';
import { useUI } from '../contexts/UIContext';
import { useBlockSubscription } from '../lib/useInk/hooks/useBlockSubscription';

type AccountId = string;

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

  useBlockSubscription(() => {
    game?.query?.dimensions('', {}).then((res) => {
      if (res.result.isOk) {
        const [x, y] = res.output?.toHuman() as string[];
        setDimensions({ x: parseInt(x), y: parseInt(y) });
      }
    });
  });

  return dimensions;
};

type GameState = {
  phase: string;
  startBlock: string;
  endBlock: string;
};

type GameInfo = {
  state: GameState | null;
};

export const useGameState = (): string | null => {
  const game = useGameContract();
  const [gameState, setGameState] = useState<string | null>(null);

  useBlockSubscription(() => {
    game?.query?.state('', {}).then((res) => {
      if (res.result.isOk) {
        const gs = res.output?.toHuman() as string;
        setGameState(gs);
      }
    });
  });

  return gameState;
};

const PLAYER_COLORS = [
  '#6effdb',
  '#ff705e',
  '#50d985',
  '#5ea4ff',
  '#f3ff73',
  '#f9e3ff',
  '#f694ff',
  '#ffc32b',
  '#3853ff',
  '#bba4c2',
];

export type Player = {
  id: string;
  name: string;
  gasUsed: number;
  storageUsed: number;
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

type Score = number;
export type PlayerScoreData = [Player, Score];

export type PlayerScore = Player & {
  score: Score;
  color: Color;
};

export const usePlayerScores = (): PlayerScore[] => {
  const game = useGameContract();
  const colors = usePlayerColors();
  const [scores, setScores] = useState<PlayerScore[]>([]);

  useBlockSubscription(() => {
    game?.query?.playerScores('', {}).then((res) => {
      if (res.result.isOk) {
        const s = res.output?.toHuman() as PlayerScoreData[];
        const sorted = [...s]
          .sort((a, b) => (a[1] >= b[1] ? 1 : 0))
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
        for (let x = 0; x < dim.x; x += 1) {
          for (let y = 0; y < dim.y; y += 1) {
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
