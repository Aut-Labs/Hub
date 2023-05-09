import {
  finalizeActivityTask,
  getAllTasks,
  getTaskById,
  submitActivityTask,
  takeActivityTask
} from "@api/activities.api";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { GroupTask, Task, TaskStatus, TaskTypes } from "@store/model";
import { ResultState } from "@store/result-status";
import { ethers } from "ethers";

export interface ActivityTaskState {
  status: ResultState;
  refreshingStatus: ResultState;
  tasks: Task[];
  selectedTabIndex: TaskTypes;
  selectedTask: Task;
  errorMessage: string;
}

const initialState: ActivityTaskState = {
  status: ResultState.Idle,
  refreshingStatus: ResultState.Idle,
  tasks: [],
  selectedTabIndex: TaskTypes.Open,
  selectedTask: null,
  errorMessage: ""
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksUpdateStatus(state, action) {
      state.status = action.payload;
    },
    tasksUpdateSelectedTab(state, action) {
      state.selectedTabIndex = action.payload;
    },
    resetTasksState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        if (state.tasks.length) {
          state.refreshingStatus = ResultState.Loading;
        } else {
          state.status = ResultState.Loading;
        }
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        if (state.tasks.length) {
          state.refreshingStatus = ResultState.Idle;
        } else {
          state.status = ResultState.Idle;
        }
        state.tasks = [...action.payload];
      })
      .addCase(getAllTasks.rejected, (state) => {
        state.refreshingStatus = ResultState.Idle;
        state.status = ResultState.Failed;
      })
      .addCase(getTaskById.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        const { task, taker } = action.payload;

        const selectedTask = {
          ...task,
          owner: taker
        };

        state.selectedTask = selectedTask;
        state.tasks = state.tasks.map((t) => {
          if (t.activityId === task.activityId) {
            return selectedTask;
          }
          return t;
        });
      })
      .addCase(getTaskById.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(takeActivityTask.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(takeActivityTask.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        state.tasks = state.tasks.map((task) => {
          if (task.activityId === action.payload.activityId) {
            return action.payload;
          }
          return task;
        });
      })
      .addCase(takeActivityTask.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(finalizeActivityTask.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(finalizeActivityTask.fulfilled, (state, action) => {
        state.status = ResultState.Success;
        state.selectedTask = action.payload;
        state.selectedTabIndex = TaskTypes.Closed;
        state.tasks = state.tasks.map((task) => {
          if (task.activityId === action.payload.activityId) {
            return action.payload;
          }
          return task;
        });
      })
      .addCase(finalizeActivityTask.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      .addCase(submitActivityTask.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(submitActivityTask.fulfilled, (state, action) => {
        state.status = ResultState.Success;
        state.selectedTask = action.payload;
        state.selectedTabIndex = TaskTypes.Closed;
        state.tasks = state.tasks.map((task) => {
          if (task.activityId === action.payload.activityId) {
            return action.payload;
          }
          return task;
        });
      })
      .addCase(submitActivityTask.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { tasksUpdateStatus, tasksUpdateSelectedTab } = tasksSlice.actions;

const NotTaken = ethers.constants.AddressZero;

export const Tasks = (state: any) => state.tasks.tasks as Task[];
export const TasksSelectedTab = (state: any) =>
  state.tasks.selectedTabIndex as number;
export const TasksStatus = (state: any) => state.tasks.status as ResultState;
export const TasksRefreshStatus = (state: any) =>
  state.tasks.refreshingStatus as ResultState;
export const SingleTask = (state: any) => state.tasks.selectedTask as Task;
export const TaskErrorMessage = (state: any) =>
  state.tasks.errorMessage as string;

export const FilteredTasks = (status: TaskTypes) =>
  createSelector(Tasks, (state: Task[]): GroupTask[] => {
    const allTasks = state.filter((task) => {
      switch (status) {
        case TaskTypes.MyTasks:
          // the taker is current logged user
          return (
            task.taker.toLocaleLowerCase() ===
            window.ethereum.selectedAddress.toLocaleLowerCase()
          );
        case TaskTypes.Ongoing:
          // someone has claimed it therefore is in progress
          return task.taker !== NotTaken && task.status !== TaskStatus.Finished;
        case TaskTypes.Closed:
          return task.status === TaskStatus.Finished;
        case TaskTypes.Open:
          // are ongoing also considered open ???
          return task.taker === NotTaken;
        default:
          return false;
      }
    });

    if (status === TaskTypes.MyTasks) {
      const { openTasks, closedTasks } = allTasks.reduce(
        (prev, curr) => {
          if (curr.status === TaskStatus.Finished) {
            prev.closedTasks = [...prev.closedTasks, curr];
          } else {
            prev.openTasks = [...prev.openTasks, curr];
          }
          return prev;
        },
        {
          openTasks: [],
          closedTasks: []
        }
      );
      return [
        {
          label: "Your Open Tasks",
          tasks: openTasks
        },
        {
          label: "Your Closed Tasks",
          tasks: closedTasks
        }
      ];
    }

    return [
      {
        label: "",
        tasks: allTasks
      }
    ];
  });

export default tasksSlice.reducer;
