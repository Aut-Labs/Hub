import { addActivityTask } from "@api/activities.api";
import { createSlice } from "@reduxjs/toolkit";
import { CurrentStep } from "@store/model";
import { ResultState } from "@store/result-status";

export interface TaskState {
  currentStep: CurrentStep;
  status: ResultState;
  taskInfo: {
    description: string;
    isCoreTeamMembersOnly: boolean;
    allParticipants: boolean;
    role: string;
    participants: number;
    title: string;
  };
}

const initialState: TaskState = {
  status: ResultState.Idle,
  currentStep: {} as CurrentStep,
  taskInfo: {
    description: null,
    isCoreTeamMembersOnly: true,
    allParticipants: false,
    participants: 1,
    role: null,
    title: ""
  }
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    activitySetCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    activityUpdateTask(state, action) {
      state.taskInfo = {
        ...state.taskInfo,
        ...action.payload
      };
    },
    activityUpdateTaskStatus(state, action) {
      state.status = action.payload;
    },
    resetActivityTaskState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(addActivityTask.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(addActivityTask.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(addActivityTask.rejected, (state) => {
        state.status = ResultState.Failed;
      });
  }
});

export const {
  activityUpdateTaskStatus,
  resetActivityTaskState,
  activityUpdateTask,
  activitySetCurrentStep
} = taskSlice.actions;

export const ActivityCurrentStep = (state: any) =>
  state.task.currentStep as CurrentStep;
export const ActivityStatus = (state: any) => state.task.status as ResultState;
export const ActivityCurrentTask = (state: any) =>
  state.task.taskInfo as typeof initialState.taskInfo;

export default taskSlice.reducer;
