import { NetworkConfig } from "@api/ProviderFactory/network.config";
import { createSelector, createSlice } from "@reduxjs/toolkit";

export enum ConnectorTypes {
  WalletConnect = "walletConnect",
  Metamask = "metamask"
}

export interface WalletProviderState {
  selectedNetwork: NetworkConfig;
  networksConfig: NetworkConfig[];
  novaAddress: string;
  selectedRoleId: string;
}

const initialState: WalletProviderState = {
  selectedNetwork: null,
  networksConfig: [],
  novaAddress: null,
  selectedRoleId: null
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
    setNetworks(state, action) {
      state.networksConfig = action.payload;
    },
    setNovaAddress(state, action) {
      state.novaAddress = action.payload;
    },
    setSelectedRoleId(state, action) {
      state.selectedRoleId = action.payload;
    },
    resetWalletProviderState: () => initialState
  }
});

export const {
  setNetworks,
  updateWalletProviderState,
  setSelectedRoleId,
  setNovaAddress
} = walletProviderSlice.actions;

export const networksConfig = (state: any) =>
  state.walletProvider.networksConfig as NetworkConfig[];
export const NetworksConfig = createSelector([networksConfig], (a) => a);

export const selectedNetwork = (state: any) =>
  state.walletProvider.selectedNetwork as NetworkConfig;
export const SelectedNetwork = createSelector([selectedNetwork], (a) => a);

export const SelectedRoleId = (state: any) =>
  state.walletProvider.selectedRoleId;

export const NovaAddress = (state: any) => state.walletProvider.novaAddress;

export const BlockExplorerUrl = createSelector(SelectedNetwork, (config) => {
  if (config) {
    return config.explorerUrls[0];
  }
});

export default walletProviderSlice.reducer;
