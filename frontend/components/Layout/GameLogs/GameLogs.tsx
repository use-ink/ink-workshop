import React from 'react';
import { useLogs } from '../../../lib/useInk/hooks/useLogs';
import { Sidebar } from '../../Sidebar';
import ReactJson from 'react-json-view';
import { useUI } from '../../../contexts/UIContext';

export const GameLogs = () => {
  const logs = useLogs();
  const { showLogs, setShowLogs } = useUI();

  return (
    <Sidebar className="bg-[#2c3e50]" show={showLogs} onClose={() => setShowLogs(false)}>
      <div className="w-full">
        <h2 className="font-bold text-center py-4 text-white">Game Event Logs</h2>
        <ul className="overflow-y-scroll flex flex-col px-3">
          {!logs.length && (
            <li className="p-3 text-sm font-semibold text-white text-center">
              <p>No logs...</p>
            </li>
          )}

          {logs.map((log) => (
            <li key={log} className="pt-3 first:pt-0 w-full">
              <ReactJson
                src={JSON.parse(log)}
                collapsed={2}
                theme="flat"
                iconStyle="circle"
                displayObjectSize={false}
                indentWidth={2}
                enableClipboard
                collapseStringsAfterLength={15}
                displayDataTypes={false}
              />
            </li>
          ))}
        </ul>
      </div>
    </Sidebar>
  );
};
