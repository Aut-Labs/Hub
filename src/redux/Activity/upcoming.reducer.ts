import { CommunityEventTypes } from "@api/api.model";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { PastPolls } from "./poll.reducer";

export interface ActivityTaskState {
  selectedTabIndex: CommunityEventTypes;
}

const initialState: ActivityTaskState = {
  selectedTabIndex: CommunityEventTypes.Ongoing
};

export const upcomingSlice = createSlice({
  name: "upcoming",
  initialState,
  reducers: {
    updateUpcomingState(state, action) {
      Object.keys(action.payload).forEach((key: string) => {
        state[key] = action.payload[key];
      });
    },
    resetUpcomingState: () => initialState
  }
});

export const { updateUpcomingState, resetUpcomingState } =
  upcomingSlice.actions;

export const UpcomingSelectedTab = (state: any) =>
  state.upcoming.selectedTabIndex as number;

export const PastEvents = createSelector(PastPolls, (polls) => {
  return [...polls];
});

export default upcomingSlice.reducer;
