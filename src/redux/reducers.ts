import { combineReducers } from "redux";
import hubReducer from "./Hub/hub.reducer";
import authSliceReducer from "../auth/auth.reducer";
import uiSliceReducer from "./ui-reducer";
import walletProviderReduce from "./WalletProvider/WalletProvider";
// import { pluginRegistryApi } from "@api/plugin-registry.api";
// import { onboardingApi } from "@api/onboarding.api";
import { hubApi } from "@api/hub.api";

export const reducers = combineReducers({
  hub: hubReducer,
  auth: authSliceReducer,
  ui: uiSliceReducer,
  walletProvider: walletProviderReduce,
  // [onboardingApi.reducerPath]: onboardingApi.reducer,
  [hubApi.reducerPath]: hubApi.reducer
  // [pluginRegistryApi.reducerPath]: pluginRegistryApi.reducer
});
