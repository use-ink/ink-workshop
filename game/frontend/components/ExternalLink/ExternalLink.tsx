import classNames from 'classnames';

type Props = {
  href: string;
  className?: string;
  secondary?: boolean;
  underline?: boolean;
  children?: React.ReactNode;
};

export const ExternalLink: React.FC<Props> = ({ className, children, href, secondary, underline }) => {
  return (
    <button
      onClick={() => window.open(href, '_blank')}
      className={classNames(
        'text-players-9 font-bold hover:text-players-9/80',
        underline && 'underline',
        secondary && 'text-players-5 hover:text-players-5/80',
        className,
      )}
    >
      {children}
    </button>
  );
};
