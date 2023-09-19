import { useContext } from 'react';
import { LogsContext } from '../providers/logs/context';

export const useLogs = (): string[] => useContext(LogsContext).logs;
