import { ReactNode } from 'react';
import { ConfigContext } from './context';
import { Config, DEFAULT_CONFIG } from './model';

interface Props {
  children: ReactNode;
  config?: Config;
}

export const ConfigProvider: React.FC<Props> = ({ children, config }) => {
  return <ConfigContext.Provider value={config || DEFAULT_CONFIG}>{children}</ConfigContext.Provider>;
};
