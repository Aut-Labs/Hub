import { NetworkConfig } from "@api/network.config";
import { createSelector, createSlice } from "@reduxjs/toolkit";

export enum ConnectorTypes {
  WalletConnect = "walletConnect",
  Metamask = "metamask"
}

export interface WalletProviderState {
  selectedNetwork: NetworkConfig;
  networksConfig: NetworkConfig[];
  hubAddress: string;
  selectedRoleId: string;
}

const initialState: WalletProviderState = {
  selectedNetwork: null,
  networksConfig: [],
  hubAddress: null,
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
    setHubAddress(state, action) {
      state.hubAddress = action.payload;
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
  setHubAddress
} = walletProviderSlice.actions;

export const NetworksConfig = (state: any) =>
  state.walletProvider.networksConfig as NetworkConfig[];

export const SelectedNetwork = (state: any) =>
  state.walletProvider.selectedNetwork as NetworkConfig;

export const SelectedRoleId = (state: any) =>
  state.walletProvider.selectedRoleId;

export const HubAddress = (state: any) => state.walletProvider.hubAddress;

export const BlockExplorerUrl = createSelector(SelectedNetwork, (config) => {
  if (config) {
    return config.explorerUrls[0];
  }
});

export default walletProviderSlice.reducer;
