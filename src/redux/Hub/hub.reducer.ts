import { ResultState } from "@store/result-status";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { HubOSHub } from "@api/hub.model";

export interface HubState {
  selectedHubAddress: string;
  hubs: HubOSHub[];
  status: ResultState;
}

const initialState: HubState = {
  selectedHubAddress: null,
  hubs: [],
  status: ResultState.Idle
};

export const hubSlice = createSlice({
  name: "hub",
  initialState,
  reducers: {
    resetHubState: () => initialState,
    hubUpdateState(state, action) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    }
  },
  extraReducers: (builder) => {}
});

export const { hubUpdateState } = hubSlice.actions;

export const HubStatus = (state) => state.hub.status as ResultState;
export const Hubs = (state) => state.hub.hubs as HubOSHub[];
export const HubAddress = (state) => state.hub.selectedHubAddress as string;
export const HubData = createSelector(Hubs, HubAddress, (hubs, address) => {
  return (
    hubs.find(
      (c) => c.properties.address.toLowerCase() === address.toLowerCase()
    ) || new HubOSHub()
  );
});

export const DiscordLink = createSelector(HubData, (c) => {
  return c.properties.socials.find((s) => s.type === "discord")?.link;
});

export const IsDiscordVerified = createSelector(HubData, (c) => {
  return !!c.properties.socials.find((s) => s.type === "discord")?.link;
});

export const allRoles = createSelector(HubData, (c) => {
  return c.properties?.rolesSets[0]?.roles || [];
});

export default hubSlice.reducer;
