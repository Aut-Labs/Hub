import { Action, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { reducers } from "./reducers";
import { hubApi } from "@api/hub.api";
import { environment, EnvMode } from "@api/environment";

type RootState = ReturnType<typeof reducers>;

const rootReducer = (state: RootState, action: Action) => {
  if (action.type === "RESET_ALL") {
    state = {
      hub: state.hub,
      hubApi: state.hubApi,
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
      serializableCheck: false,
      immutableCheck: false
    }).concat(
      environment.env === EnvMode.Development ? logger : [],
      hubApi.middleware
    ),
  reducer: rootReducer
});

export default store;
