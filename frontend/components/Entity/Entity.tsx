/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import { animated, useSpring, config, easings } from 'react-spring';

type Props = {
  src: string;
  alt: string;
  className?: string;
  bob?: number;
  sway?: number;
  duration?: number;
  startLeft?: boolean;
  startDown?: boolean;
};

export const Entity: React.FC<Props> = ({ src, className, alt, bob, sway, startLeft, duration, startDown }) => {
  const halfSway = (sway || 0) / 2;
  const startSway = startLeft ? -halfSway : halfSway;
  const endSway = startLeft ? halfSway : -halfSway;

  const halfBob = (bob || 0) / 2;
  const startBob = startDown ? -halfBob : halfBob;
  const endBob = startDown ? halfBob : -halfBob;

  const springProps = useSpring({
    loop: { reverse: true },
    from: { y: startBob, x: startSway },
    to: { y: endBob || 0, x: endSway },
    config: { duration: duration || 2500, ...config.molasses, easing: easings.easeInOutSine },
  });
  return <animated.img src={src} className={classNames('w-12', className)} alt={alt} style={springProps} />;
};
