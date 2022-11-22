import React, { createContext, ReactNode, useContext, useState } from 'react';

type UI = {
  showAccounts: boolean;
  showWalletConnect: boolean;
  showRules: boolean;
  setShowRules: (_: boolean) => void;
  showGrid: boolean;
  setShowGrid: (_: boolean) => void;
  darkMode: boolean;
  setDarkMode: (_: boolean) => void;
  showCoordinates: boolean;
  setShowCoordinates: (_: boolean) => void;
  setShowWalletConnect: (_: boolean) => void;
  setPlayer: (_: string | null) => void;
  player: string | null;
  showSettings: boolean;
  setShowSettings: (_: boolean) => void;
};

const DEFAULT_UI: UI = {
  showAccounts: false,
  showWalletConnect: false,
  showRules: false,
  showGrid: true,
  setShowGrid: (_: boolean) => null,
  showCoordinates: true,
  setDarkMode: (_: boolean) => null,
  darkMode: false,
  setShowCoordinates: (_: boolean) => null,
  setShowRules: (_: boolean) => null,
  setShowWalletConnect: (_: boolean) => null,
  setPlayer: (_: string | null) => null,
  player: null,
  setShowSettings: (_: boolean) => null,
  showSettings: false,
};

const useUIValues = (): UI => {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [player, setPlayer] = useState<string | null>(null);
  return {
    ...DEFAULT_UI,
    showWalletConnect,
    setShowWalletConnect,
    setShowRules,
    showRules,
    darkMode,
    setDarkMode,
    player,
    setPlayer,
    showSettings,
    setShowSettings,
    showGrid,
    setShowGrid,
    showCoordinates,
    setShowCoordinates,
  };
};

export const UIContext = createContext<UI>(DEFAULT_UI);

export const useUI = () => useContext(UIContext);

const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useUIValues();
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export default UIProvider;
