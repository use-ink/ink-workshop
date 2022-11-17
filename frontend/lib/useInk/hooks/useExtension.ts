import { useContext } from 'react';
import { ExtensionContext } from '../providers/extension/context';

export type { Extension } from '../providers/extension/model';

export const useExtension = () => useContext(ExtensionContext);
