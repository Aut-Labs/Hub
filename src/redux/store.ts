import { Action, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { reducers } from "./reducers";
import { pluginRegistryApi } from "@api/plugin-registry.api";
import { onboardingApi } from "@api/onboarding.api";
import { communityApi } from "@api/community.api";
// import storage from "redux-persist/lib/storage";
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
//   REHYDRATE,
//   persistReducer
// } from "redux-persist";

// import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
// const persistConfig = {
//   key: "aut-dashboard",
//   storage,
//   whitelist: [],
//   blacklist: ["walletProvider", "auth"]
//   // stateReconciler: autoMergeLevel1
// };
// const persistedReducer = persistReducer(persistConfig, reducers);

type RootState = ReturnType<typeof reducers>;

const rootReducer = (state: RootState, action: Action) => {
  if (action.type === "RESET_ALL") {
    state = {
      communityApi: state.communityApi,
      walletProvider: state.walletProvider,
      auth: state.auth
    } as RootState;
  }
  return reducers(state, action);
};

export const resetState = { type: "RESET_ALL" };

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      // },
      serializableCheck: false,
      immutableCheck: false
    }).concat(
      logger,
      pluginRegistryApi.middleware,
      onboardingApi.middleware,
      communityApi.middleware
    ),
  reducer: rootReducer
});

export default store;
