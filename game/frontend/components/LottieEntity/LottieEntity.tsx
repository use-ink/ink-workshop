/* eslint-disable @next/next/no-img-element */
import { Player } from '@lottiefiles/react-lottie-player';

type Props = {
  src: string;
  className?: string;
};

export const LottieEntity: React.FC<Props> = ({ src, className }) => {
  return (
    <div className={className}>
      <Player autoplay loop src={src} />
    </div>
  );
};
