import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { JsonRpcSigner, ethers } from "ethers";

export enum ConnectorTypes {
  WalletConnect = "walletConnect",
  Metamask = "metamask"
}

export interface WalletProviderState {
  signer: ethers.JsonRpcSigner;
  selectedWalletType: "injected" | "walletConnect";
  selectedNetwork: string;
  networksConfig: NetworkConfig[];
  isOpen: boolean;
  sdkInitialized: boolean;
  wallets: any;
  isAuthorised: boolean;
}

const initialState: WalletProviderState = {
  isAuthorised: false,
  signer: null,
  selectedWalletType: null,
  selectedNetwork: null,
  isOpen: false,
  sdkInitialized: false,
  networksConfig: [],
  wallets: {}
};

export const walletProviderSlice = createSlice({
  name: "walletProvider",
  initialState,
  reducers: {
    updateWalletProviderState(state, action) {
      Object.keys(action.payload).forEach((key: string) => {
        state[key] = action.payload[key];
      });
    },
    setSigner(state, action) {
      state.signer = action.payload;
    },
    setWallet(state, action) {
      state.selectedWalletType = action.payload;
    },
    setProviderIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setNetwork(state, action) {
      state.selectedNetwork = action.payload as string;
    },
    setNetworks(state, action) {
      state.networksConfig = action.payload;
    },
    initializeSdk(state, action) {
      state.sdkInitialized = action.payload;
    },
    resetWalletProviderState: () => initialState
  }
});

export const {
  setSigner,
  setWallet,
  setNetwork,
  setNetworks,
  updateWalletProviderState,
  initializeSdk,
  setProviderIsOpen
} = walletProviderSlice.actions;

export const IsAuthorised = (state: any) =>
  state.walletProvider.isAuthorised as boolean;

const networkSelectorIsOpen = (state: any) =>
  state.walletProvider.isOpen as boolean;
export const NetworkSelectorIsOpen = createSelector(
  [networkSelectorIsOpen],
  (a) => a
);

export const ssSdkInitialized = (state: any) =>
  state.walletProvider.sdkInitialized as boolean;
export const IsSdkInitialized = createSelector([ssSdkInitialized], (a) => a);

export const selectedWalletType = (state: any) =>
  state.walletProvider.selectedWalletType as string;
export const SelectedWalletType = createSelector(
  [selectedWalletType],
  (a) => a
);

export const networkSigner = (state: any) =>
  state.walletProvider.signer as JsonRpcSigner;
export const NetworkSigner = createSelector([networkSigner], (a) => a);

export const networksConfig = (state: any) =>
  state.walletProvider.networksConfig as NetworkConfig[];
export const NetworksConfig = createSelector([networksConfig], (a) => a);

export const selectedNetwork = (state: any) =>
  state.walletProvider.selectedNetwork as string;
export const SelectedNetwork = createSelector([selectedNetwork], (a) => a);

export const SelectedNetworkConfig = createSelector(
  NetworksConfig,
  SelectedNetwork,
  (networks, networkName) => networks.find((r) => r.network === networkName)
);

export const BlockExplorerUrl = createSelector(
  SelectedNetworkConfig,
  (config) => {
    if (config) {
      return config.explorerUrls[0];
    }
  }
);

export const NetworkWalletConnectors = (state: any) =>
  state.walletProvider.wallets as any;
export const NetworkConnector = (connectorName: string) =>
  createSelector(NetworkWalletConnectors, (x1) => x1[connectorName]);

export default walletProviderSlice.reducer;
