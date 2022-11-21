import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';

export type Extension = {
  accounts: InjectedAccountWithMeta[] | null;
  setActiveAccount: (account: InjectedAccountWithMeta | null) => void;
  activeAccount?: InjectedAccountWithMeta | null;
  activeSigner?: InjectedExtension | null;
  fetchAccounts: () => void;
};

export const EXTENSION_DEFAULTS: Extension = {
  accounts: null,
  setActiveAccount: (_: InjectedAccountWithMeta | null) => null,
  activeAccount: null,
  fetchAccounts: () => null,
};
