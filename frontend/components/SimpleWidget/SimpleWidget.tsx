import classNames from 'classnames';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export const SimpleWidget: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'bg-brand-200 border-4 border-players-9 rounded-xl py-2 px-3 flex flex-col text-xs drop-shadow-md',
        className,
      )}
    >
      {children}
    </div>
  );
};
