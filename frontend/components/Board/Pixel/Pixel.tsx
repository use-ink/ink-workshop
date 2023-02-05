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
  events?: TurnEvent[];
};

export const Pixel: React.FC<Props> = ({ owner, color, x, y, events }) => {
  const { showGrid, showCoordinates } = useUI();
  const [pulse, setPulse] = useState(owner ? 1 : 0);
  const props = useSpring({ x: pulse, config: config.default });

  useEffect(() => {
    if (owner) setPulse(1);
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
      {showCoordinates && (
        <p className="text-xs text-black/20" style={{ color: color ? color : '' }}>
          {x}, {y}
        </p>
      )}
    </animated.span>
  );
};
