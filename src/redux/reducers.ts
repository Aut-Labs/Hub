import { combineReducers } from "redux";
import taskReducer from "@store/Activity/task.reducer";
import communityReducer from "./Community/community.reducer";
import authSliceReducer from "../auth/auth.reducer";
import uiSliceReducer from "./ui-reducer";
import tasksReducer from "./Activity/tasks.reducer";
import callReducer from "./Activity/call.reducer";
import pollReducer from "./Activity/poll.reducer";
import autDashboardReducer from "./AutDashboard/aut-dashboard.reducer";
import upcomingReducer from "./Activity/upcoming.reducer";
import walletProviderReduce from "./WalletProvider/WalletProvider";
import { pluginRegistryApi } from "@api/plugin-registry.api";
import { onboardingApi } from "@api/onboarding.api";
import { communityApi } from "@api/community.api";

export const reducers = combineReducers({
  community: communityReducer,
  dashboard: autDashboardReducer,
  auth: authSliceReducer,
  ui: uiSliceReducer,
  task: taskReducer,
  tasks: tasksReducer,
  call: callReducer,
  poll: pollReducer,
  upcoming: upcomingReducer,
  walletProvider: walletProviderReduce,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [pluginRegistryApi.reducerPath]: pluginRegistryApi.reducer
});
