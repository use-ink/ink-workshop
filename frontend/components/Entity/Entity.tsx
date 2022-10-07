/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export const Entity: React.FC<Props> = ({ src, className, alt }) => {
  return <img src={src} className={classNames('w-12', className)} alt={alt} />;
};
