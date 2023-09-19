import { useContext } from 'react';
import { ConfigContext } from '../providers/config/context';

export type { Config } from '../providers/config/model';

export const useConfig = () => useContext(ConfigContext);
