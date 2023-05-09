import { addPoll, getPolls } from "@api/activities.api";
import { ActivityPoll, ActivityPollData } from "@api/api.model";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ResultState } from "@store/result-status";
import { addDays, isBefore } from "date-fns";

export interface PollState {
  status: ResultState;
  errorMessage: string;
  polls: ActivityPoll[];
  pollData: ActivityPollData;
}

const initialState: PollState = {
  status: ResultState.Idle,
  errorMessage: "",
  polls: [],
  pollData: {
    title: "",
    description: "",
    duration: "",
    options: [
      {
        option: "",
        emoji: null
      },
      {
        option: "",
        emoji: null
      }
    ],
    role: null,
    allRoles: null
  }
};

export const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    pollUpdateData(state, action) {
      state.pollData = {
        ...state.pollData,
        ...action.payload
      };
    },
    pollUpdateStatus(state, action) {
      state.status = action.payload;
    },
    resetPollState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPoll.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(addPoll.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(addPoll.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      .addCase(getPolls.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(getPolls.fulfilled, (state, action) => {
        state.polls = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(getPolls.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { pollUpdateData, pollUpdateStatus, resetPollState } =
  pollSlice.actions;

const pollDurations = {
  "1d": "1",
  "1w": "7",
  "1mo": "30"
};

export const PollStatus = (state: any) => state.poll.status as ResultState;
export const PollError = (state: any) => state.poll.errorMessage as string;
export const Polls = (state: any) => state.poll.polls as ActivityPoll[];

export const UpcomingPolls = createSelector(Polls, (polls) => {
  return polls.filter((poll) => {
    const startDate = new Date(+poll.timestamp * 1000);
    const duration = pollDurations[poll.pollData.duration];
    const endDate = addDays(startDate, duration);
    const today = new Date();
    return isBefore(today, endDate);
  });
});
export const PastPolls = createSelector(Polls, (polls) => {
  return polls.filter((poll) => {
    const startDate = new Date(+poll.timestamp * 1000);
    const duration = pollDurations[poll.pollData.duration];
    const endDate = addDays(startDate, duration);
    const today = new Date();
    return isBefore(endDate, today);
  });
});
export const CreatePollData = (state: any) =>
  state.poll.pollData as typeof initialState.pollData;

export default pollSlice.reducer;
