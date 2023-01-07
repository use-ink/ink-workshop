import { createContext } from 'react';

export const LogsContext = createContext<{
  logs: string[];
  addLog: (log: string) => void;
}>({
  logs: [],
  addLog: () => null,
});
