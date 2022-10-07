import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { useEffect, useState } from 'react';

export type Extension = {
  accounts: InjectedAccountWithMeta[] | null;
  setActiveAccount: (account: InjectedAccountWithMeta) => void;
  activeAccount?: InjectedAccountWithMeta | null;
  activeSigner?: InjectedExtension | null;
  isConnected: boolean;
  fetchAccounts: () => void;
};

export const EXTENSION_DEFAULTS: Extension = {
  accounts: null,
  setActiveAccount: (_: InjectedAccountWithMeta) => null,
  activeAccount: null,
  fetchAccounts: () => null,
  isConnected: false,
};

export const useExtension = (web3OriginName?: string): Extension => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [activeAccount, setActiveAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [activeSigner, setActiveSigner] = useState<InjectedExtension | null>(null);

  useEffect(() => {
    activeAccount && web3FromAddress(activeAccount?.address || '').then((v) => setActiveSigner(v));
  }, [activeAccount]);

  const fetchAccounts = async () => {
    try {
      const extensions = await web3Enable(web3OriginName || 'Extension');
      if (extensions.length === 0) return;
      await web3Accounts().then((list) => setAccounts(list));
    } catch (err) {
      console.error('Extension setup failed', err);
    }
  };

  return {
    accounts,
    setActiveAccount,
    activeAccount,
    activeSigner,
    isConnected: Boolean(activeAccount),
    fetchAccounts,
  };
};
