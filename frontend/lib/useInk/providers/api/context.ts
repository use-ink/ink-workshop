import { createContext } from 'react';
import { API } from './model';

export const APIContext = createContext<API>({
  api: undefined,
  provider: undefined,
});
