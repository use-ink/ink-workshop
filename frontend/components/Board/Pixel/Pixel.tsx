import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useAudioSettings } from '../../../hooks/useAudioSettings';

type Props = {
  x: number;
  y: number;
  owner?: string | null;
  color?: string;
  isSmallBoard?: boolean;
};

export const Pixel: React.FC<Props> = ({ isSmallBoard, owner, color, x, y }) => {
  const { successEffect } = useAudioSettings();
  const [pulse, setPulse] = useState(Boolean(owner));
  const props = useSpring({ x: pulse ? 1 : 0 });

  useEffect(() => {
    if (owner) {
      successEffect?.play();
      setTimeout(() => {}, 300);
    }
  }, [owner]);

  return (
    <animated.span
      style={{
        transform: props.x
          .to({
            range: [0, 0.25, 0.5, 0.75, 1],
            output: [1.01, 1.3, 0.8, 1.2, 1],
          })
          .to((x) => `scale(${x})`),
        backgroundColor: color || 'rgba(0,0,0,0.035)',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.05)',
      }}
      className={classNames(
        'w-full h-full flex items-center justify-center transition duration-100',
        owner && 'drop-shadow-xl',
      )}
    >
      {!owner && isSmallBoard && (
        <p className="text-xs text-black/20 transition duration-100">
          ({x},{y})
        </p>
      )}
    </animated.span>
  );
};
