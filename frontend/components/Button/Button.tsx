import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick: () => any;
};

export const Button: React.FC<Props> = ({ onClick, className, children }) => {
  return (
    <button
      className={classNames(
        'rounded-md bg-brand-500 hover:bg-brand-300 text-sm uppercase text-white',
        'duration-25 transition px-6 py-2 text-center font-semibold border-white/20 border',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
