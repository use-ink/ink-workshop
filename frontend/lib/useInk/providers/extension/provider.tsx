import { ReactNode, useEffect, useState } from 'react';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { ExtensionContext } from './context';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

interface Props {
  children: ReactNode;
}

// @internal
export const ExtensionProvider: React.FC<Props> = ({ children }) => {
  const [web3OriginName, setWeb3OriginName] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [activeAccount, setActiveAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [activeSigner, setActiveSigner] = useState<InjectedExtension | null>(null);

  useEffect(() => {
    web3FromAddress(activeAccount?.address || '').then((v) => setActiveSigner(v));
  }, [activeAccount?.address]);

  const fetchAccounts = async () => {
    try {
      const extensions = await web3Enable(web3OriginName || 'Extension');
      if (extensions.length === 0) return;
      await web3Accounts().then((list) => {
        setAccounts(list);
        const first = list.length && list[0];
        first && !activeAccount && setActiveAccount(first);
      });
    } catch (err) {
      console.error('Extension setup failed', err);
    }
  };

  const value = {
    accounts,
    activeAccount,
    activeSigner,
    fetchAccounts,
    setActiveAccount,
    setWeb3OriginName,
  };

  return <ExtensionContext.Provider value={value}>{children}</ExtensionContext.Provider>;
};
