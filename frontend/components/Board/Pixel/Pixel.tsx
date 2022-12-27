import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { animated, config, useSpring } from 'react-spring';
import { useUI } from '../../../contexts/UIContext';
import { useAudioSettings } from '../../../hooks/useAudioSettings';
import { TurnEvent } from '../../../hooks/useGameEvents';

type Props = {
  x: number;
  y: number;
  owner?: string | null;
  color?: string;
  isSmallBoard?: boolean;
  events?: TurnEvent[];
  players: { [id: string]: string };
};

const IMAGE_MAP = {
  Success: '/star-fish.svg',
  Occupied: '/spider-crab.svg',
  OutOfBounds: '/spider-crab.svg',
  BrokenPlayer: '/spider-crab.svg',
};

export const Pixel: React.FC<Props> = ({ isSmallBoard, owner, color, x, y, events, players }) => {
  const { successEffect, failureEffect } = useAudioSettings();
  const { showGrid, showCoordinates } = useUI();
  const [skipPlayOnLoad] = useState(Boolean(owner));
  const [pulse, setPulse] = useState(owner ? 1 : 0);
  const props = useSpring({ x: pulse, config: config.default });
  const gameEvents: TurnEvent[] = events || [];

  useEffect(() => {
    if (gameEvents.find(({ name }) => name === 'Occupied')) {
      failureEffect?.play();
    }
  }, [gameEvents]);

  useEffect(() => {
    if (owner) {
      setPulse(1);
      !skipPlayOnLoad && successEffect?.play();
    }
  }, [owner]);

  return (
    <animated.span
      style={{
        transform: props.x
          .to({
            range: [0, 0.5, 1],
            output: [1.0, 2.5, 1.0],
          })
          .to((x) => `scale(${x})`),
        backgroundColor: 'rgba(0,0,0,0.035)',
        background: color,
        boxShadow: showGrid || owner ? 'inset 0 0 0 0.5px rgba(0,0,0,0.075)' : '',
      }}
      className={classNames('transition duration-100 w-full h-full', !owner && 'flex items-center justify-center')}
    >
      {gameEvents.map((e) => (
        <div key={e.id} className="w-full mx-auto h-full">
          <span className="w-full h-full fixed flex flex-col items-center justify-center">
            <img src={IMAGE_MAP[e.name]} className="w-1/3" />
            <p className="text-xs">{players[e.player]}</p>
          </span>
        </div>
      ))}
      {isSmallBoard && showCoordinates && (
        <p className="text-xs text-black/20" style={{ color: color ? color : '' }}>
          {x}, {y}
        </p>
      )}
    </animated.span>
  );
};
