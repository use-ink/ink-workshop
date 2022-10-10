import { useEffect, useMemo, useState } from 'react';
import { ABI } from '../constants';
import { useContract } from '../lib/useInk/hooks';
import { useInk } from '../lib/useInk';
import { useUI } from '../contexts/UIContext';

export const useGameContract = () => {
  const {
    rpcURL,
    game: { address },
  } = useUI();
  return useContract(address || '', ABI, rpcURL);
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

export const useGameState = (): string | null => {
  const game = useGameContract();
  const [gameState, setGameState] = useState<string | null>(null);

  useEffect(() => {
    game?.query?.state('', {}).then((res) => {
      if (res.result.isOk) {
        const gs = res.output?.toHuman() as string;
        setGameState(gs);
      }
    });
  }, [game]);

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

  useEffect(() => {
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
  }, [game]);

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

  useEffect(() => {
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
  }, [colors, game]);

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

  useEffect(() => {
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
  }, [game, dim, colors]);

  return board;
};

type AccountId = string;

type Status = 'pending' | 'finalized' | 'none';

type Response = {
  send: () => void;
  status: Status;
};

export const useStartGameFunc = (): Response => {
  const game = useGameContract();
  const { activeAccount, activeSigner } = useInk();
  const [status, setStatus] = useState<Status>('none');

  const send = useMemo(
    () => () => {
      if (!activeAccount || !game || !activeSigner) return () => null;

      game.tx
        .startGame({ gasLimit: -1 })
        .signAndSend(activeAccount.address, { signer: activeSigner.signer }, async (result) => {
          if (result.status.isInBlock) {
            setStatus('pending');
          } else if (result.status.isFinalized) {
            setStatus('finalized');
          }
        });
    },
    [activeAccount, activeSigner, game],
  );

  return {
    send,
    status,
  };
};
