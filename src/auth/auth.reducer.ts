import { AutID } from "@api/aut.model";
import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  userInfo: any;
  userAddress: string;
  connectStatus:
    | "initial"
    | "start"
    | "connecting"
    | "connected"
    | "failed"
    | "disconnecting"
    | "disconnected";
}

const initialState: AuthState = {
  isAuthenticated: false,
  userAddress: null,
  userInfo: null,
  connectStatus: "initial"
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      const { isAuthenticated, userInfo } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.userInfo = userInfo;
    },
    changeConnectStatus(state, action) {
      state.connectStatus = action.payload;
    },
    setUserAddress(state, action) {
      state.userAddress = action.payload;
    },
    resetAuthState: () => initialState
  }
});

export const {
  changeConnectStatus,
  setAuthenticated,
  setUserAddress,
  resetAuthState
} = authSlice.actions;

export const userInfo = (state) => state.auth.userInfo as AutID;
export const UserInfo = createSelector([userInfo], (a) => a);
export const isAuthenticated = (state) => state.auth.isAuthenticated as boolean;
export const ConnectStatus = (state) =>
  state.auth.connectStatus as
    | "initial"
    | "start"
    | "connecting"
    | "connected"
    | "failed"
    | "disconnecting"
    | "disconnected";
export const IsAuthenticated = createSelector([isAuthenticated], (a) => a);

export default authSlice.reducer;
