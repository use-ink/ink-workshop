import React, { createContext, useContext } from 'react';
import { Extension, EXTENSION_DEFAULTS, useExtension } from './hooks/useExtension';

type InkDappItems = Extension;

const DEFAULTS: InkDappItems = {
  ...EXTENSION_DEFAULTS,
};

const InkContext = createContext<InkDappItems>({
  ...DEFAULTS,
});

type InkConfig = {
  children?: React.ReactNode;
};

const InkProvider: React.FC<InkConfig> = ({ children }) => {
  const extension = useExtension();
  return <InkContext.Provider value={{ ...DEFAULTS, ...extension }}>{children}</InkContext.Provider>;
};

export const useInk = () => useContext(InkContext);

export default InkProvider;
