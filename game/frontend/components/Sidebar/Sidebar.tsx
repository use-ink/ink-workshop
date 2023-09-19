import classNames from 'classnames';
import { ReactNode } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { animated, useSpring } from 'react-spring';

type Props = {
  children: ReactNode;
  show: boolean;
  className?: string;
  onClose: () => any;
};

export const Sidebar: React.FC<Props> = ({ show, children, onClose, className }) => {
  const width = 800;
  const transactionPanelProps = useSpring({
    from: { translateX: -width, width },
    to: { translateX: show ? 0 : -width },
  });

  return (
    <animated.div
      style={transactionPanelProps}
      className={classNames(
        'fixed left-0 bottom-0 overflow-y-scroll h-full z-10 bg-players-4 text-left drop-shadow-2xl',
        className,
      )}
    >
      <button className="absolute top-3 right-3" onClick={onClose}>
        <RiCloseLine size={28} className="hover:scale-110 text-white/80 hover:text-white transition duration-75" />
      </button>
      {children}
    </animated.div>
  );
};
