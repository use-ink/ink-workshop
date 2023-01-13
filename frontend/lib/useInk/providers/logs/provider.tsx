import { ReactNode, useState } from 'react';
import { LogsContext } from './context';

interface Props {
  children: ReactNode;
}

// @internal
export const LogsProvider = ({ children }: Props) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs([log, ...logs]);
  };

  return <LogsContext.Provider value={{ addLog, logs }} children={children} />;
};
