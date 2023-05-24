import { combineReducers } from "redux";
import communityReducer from "./Community/community.reducer";
import authSliceReducer from "../auth/auth.reducer";
import uiSliceReducer from "./ui-reducer";
import walletProviderReduce from "./WalletProvider/WalletProvider";
import { pluginRegistryApi } from "@api/plugin-registry.api";
import { onboardingApi } from "@api/onboarding.api";
import { communityApi } from "@api/community.api";

export const reducers = combineReducers({
  community: communityReducer,
  auth: authSliceReducer,
  ui: uiSliceReducer,
  walletProvider: walletProviderReduce,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [pluginRegistryApi.reducerPath]: pluginRegistryApi.reducer
});
