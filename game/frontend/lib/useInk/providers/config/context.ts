import { createContext } from 'react';
import { Config, DEFAULT_CONFIG } from './model';

export const ConfigContext = createContext<Config>(DEFAULT_CONFIG);
