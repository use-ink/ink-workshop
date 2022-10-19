import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => any;
};

export const Button: React.FC<Props> = ({ onClick, className, children, disabled }) => {
  return (
    <button
      disabled={disabled}
      className={classNames(
        'rounded-lg bg-brand-600 hover:bg-brand-500/90 text-sm text-white font-fred tracking-wide',
        'duration-25 transition px-6 py-2 text-center font-semibold border-white/20 border',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
