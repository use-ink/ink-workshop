import { createContext } from 'react';
import { BlockHeader, BLOCK_HEADER_DEFAULTS } from './model';

export const BlockHeaderContext = createContext<BlockHeader>({
  ...BLOCK_HEADER_DEFAULTS,
});
