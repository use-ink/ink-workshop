import { useContext } from 'react';
import { BlockHeaderContext } from '../providers/blockHeader/context';

export type { BlockHeader } from '../providers/blockHeader/model';

export const useBlockHeader = () => useContext(BlockHeaderContext);
