import { createContext } from 'react';
import { Extension, EXTENSION_DEFAULTS } from './model';

export const ExtensionContext = createContext<Extension>({
  ...EXTENSION_DEFAULTS,
});
