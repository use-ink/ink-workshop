import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const CodeBlock: React.FC<Props> = ({ className, children }) => {
  return (
    <code className={classNames('bg-gray-200 text-brand-500 text-xs rounded-md px-2 py-[4px]', className)}>
      {children}
    </code>
  );
};
